#!/usr/bin/env node
/*
Simple scanner to map file references and produce a conservative classification:
- "wajib": reachable from app/pages/api roots
- "pertimbangkan": content files or files not reachable but likely used dynamically
- "tidak digunakan": code files not referenced anywhere
Outputs: analysis/usage.json, analysis/classification.json, analysis/tree.txt
*/
const fs = require('fs');
const path = require('path');
const root = process.cwd();

const IGNORE = new Set(['node_modules', '.git', '.next', 'dist', 'out', 'coverage', '.vercel']);
const CODE_EXTS = ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'];
const CONTENT_EXTS = ['.md', '.mdx', '.json'];

function walk(dir, fileList = []){
  const names = fs.readdirSync(dir, { withFileTypes: true });
  for(const d of names){
    if(IGNORE.has(d.name)) continue;
    const full = path.join(dir, d.name);
    if(d.isDirectory()) walk(full, fileList);
    else fileList.push(full);
  }
  return fileList;
}

function isCode(f){ return CODE_EXTS.includes(path.extname(f).toLowerCase()); }
function isContent(f){ return CONTENT_EXTS.includes(path.extname(f).toLowerCase()); }

function readFileSafe(p){ try{ return fs.readFileSync(p,'utf8'); }catch(e){ return ''; } }

function resolveImport(fromFile, importPath){
  if(!importPath) return null;
  if(importPath.startsWith('..') || importPath.startsWith('./') || importPath.startsWith('/')){
    // resolve relative to fromFile
    let base = importPath.startsWith('/') ? path.join(root, importPath) : path.resolve(path.dirname(fromFile), importPath);
    const candidates = [];
    if(path.extname(base)) candidates.push(base);
    else{
      for(const ext of CODE_EXTS.concat(['.json','.css','.scss','.md','.mdx'])) candidates.push(base + ext);
      candidates.push(path.join(base, 'index.js'));
      candidates.push(path.join(base, 'index.ts'));
      candidates.push(path.join(base, 'index.tsx'));
      candidates.push(path.join(base, 'index.jsx'));
    }
    for(const c of candidates){ if(fs.existsSync(c)) return path.normalize(c); }
    return null;
  }
  return null; // external package
}

function parseImports(content){
  const imports = new Set();
  const importRegex = /import\s+(?:[^'\n]+from\s+)?['"]([^'"]+)['"];?/g;
  const requireRegex = /require\(['"]([^'"]+)['"]\)/g;
  const dynamicRegex = /import\(['"]([^'"]+)['"]\)/g;
  let m;
  while((m = importRegex.exec(content))){ imports.add(m[1]); }
  while((m = requireRegex.exec(content))){ imports.add(m[1]); }
  while((m = dynamicRegex.exec(content))){ imports.add(m[1]); }
  return Array.from(imports);
}

console.log('Scanning files...');
const allFiles = walk(root).map(f => path.normalize(f));
const projectFiles = allFiles.filter(f => !f.includes(path.join('node_modules')));

const codeFiles = projectFiles.filter(isCode);
const contentFiles = projectFiles.filter(isContent);

const graph = {}; // file -> {references:[], referencedBy:[]}
for(const f of projectFiles) graph[f] = {references: new Set(), referencedBy: new Set(), size: 0};

for(const f of codeFiles){
  const txt = readFileSafe(f);
  const imports = parseImports(txt);
  for(const imp of imports){
    const resolved = resolveImport(f, imp);
    if(resolved && graph[resolved]){
      graph[f].references.add(resolved);
      graph[resolved].referencedBy.add(f);
    }
  }
}

// Identify roots (app pages/layout/route, pages, api routes, next.config.js, package.json)
const roots = new Set();
for(const f of projectFiles){
  const rel = path.relative(root, f).replace(/\\/g, '/');
  const b = path.basename(f, path.extname(f));
  if(rel.startsWith('app/') && ['page','layout','route','loading','error','template'].includes(b)) roots.add(f);
  if(rel.startsWith('app/') && /route\.(js|ts|tsx|jsx)$/.test(f)) roots.add(f);
  if(rel.startsWith('pages/') && (b==='index' || /\.(js|ts|tsx|jsx)$/.test(f))) roots.add(f);
  if(rel.startsWith('app/api/') || rel.startsWith('api/')) roots.add(f);
}
const nextConfig = path.join(root, 'next.config.js');
if(fs.existsSync(nextConfig)) roots.add(nextConfig);
const pkg = path.join(root, 'package.json');
if(fs.existsSync(pkg)) roots.add(pkg);

// BFS to mark reachable
const reachable = new Set();
const q = Array.from(roots);
for(const r of q) if(r) reachable.add(r);
while(q.length){
  const cur = q.shift();
  for(const to of graph[cur] ? Array.from(graph[cur].references) : []){
    if(!reachable.has(to)){
      reachable.add(to);
      q.push(to);
    }
  }
}

// Classification
const classification = { wajib: [], pertimbangkan: [], 'tidak digunakan': [] };
for(const f of projectFiles){
  const rel = path.relative(root, f).replace(/\\/g, '/');
  if(reachable.has(f)) classification.wajib.push(rel);
  else{
    if(isContent(f) || rel.startsWith('content/') || rel.startsWith('emails/') || rel.startsWith('public/')) classification.pertimbangkan.push(rel);
    else classification['tidak digunakan'].push(rel);
  }
}

// Create a textual tree
function treeText(dir, prefix=''){
  const names = fs.readdirSync(dir).filter(n=>!IGNORE.has(n)).sort();
  let out = '';
  for(let i=0;i<names.length;i++){
    const name = names[i];
    const isLast = i===names.length-1;
    const p = path.join(dir, name);
    const connector = isLast ? '└─ ' : '├─ ';
    out += prefix + connector + name + '\n';
    if(fs.statSync(p).isDirectory()){
      out += treeText(p, prefix + (isLast ? '   ' : '│  '));
    }
  }
  return out;
}
const tree = treeText(root);

if(!fs.existsSync(path.join(root,'analysis'))) fs.mkdirSync(path.join(root,'analysis'));
fs.writeFileSync(path.join(root,'analysis','usage.json'), JSON.stringify(Object.fromEntries(Object.entries(graph).map(([k,v])=>[path.relative(root,k).replace(/\\/g,'/'), {references: Array.from(v.references).map(x=>path.relative(root,x).replace(/\\/g,'/')), referencedBy: Array.from(v.referencedBy).map(x=>path.relative(root,x).replace(/\\/g,'/'))}])), null, 2));
fs.writeFileSync(path.join(root,'analysis','classification.json'), JSON.stringify(classification, null, 2));
fs.writeFileSync(path.join(root,'analysis','tree.txt'), tree);

// Quick Next.js API scan
const codeAllText = codeFiles.map(f=>readFileSafe(f)).join('\n');
const issues = [];
const patterns = [
  ['getServerSideProps','getServerSideProps - server props (pages) found; consider app router patterns if migrating to app/'],
  ['getStaticProps','getStaticProps - static props (pages) found; check for app router migration'],
  ['getInitialProps','getInitialProps - legacy getInitialProps found'],
  ['next/head','usage of next/head - in app router prefer head.tsx or <Head/> differences'],
  ['next/image','next/image usage - check changes in Next.js image component props'],
  ['next/link','next/link usage - verify new Link behavior and legacyBehavior'],
  ['unstable_','uses unstable_ APIs - review for removal in future versions']
];
for(const [pat, msg] of patterns){ if(codeAllText.includes(pat)) issues.push(msg); }

fs.writeFileSync(path.join(root,'analysis','next-issues.json'), JSON.stringify({issues}, null, 2));

console.log('Done. Outputs in analysis/: usage.json, classification.json, tree.txt, next-issues.json');
console.log('Summary: files:', projectFiles.length, 'code files:', codeFiles.length, 'content files:', contentFiles.length);
console.log('Roots considered:', Array.from(roots).map(r=>path.relative(root,r)).slice(0,50).join(', '));
console.log('Counts - wajib:', classification.wajib.length, 'pertimbangkan:', classification.pertimbangkan.length, 'tidak digunakan:', classification['tidak digunakan'].length);

process.exit(0);
