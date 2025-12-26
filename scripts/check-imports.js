const fs = require('fs');
const path = require('path');

const root = process.cwd();
const exts = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.json'];

function listFiles(dir) {
  const res = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (full.includes('node_modules') || full.includes('.next')) continue;
      res.push(...listFiles(full));
    } else {
      res.push(full);
    }
  }
  return res;
}

function checkCaseSensitiveParts(fullPath) {
  const rel = path.relative(root, fullPath);
  const parts = rel.split(path.sep);
  let cur = root;
  for (const part of parts) {
    const names = fs.readdirSync(cur);
    const found = names.find(n => n.toLowerCase() === part.toLowerCase());
    if (!found) return false;
    if (found !== part) return { expected: part, actual: found };
    cur = path.join(cur, found);
  }
  return true;
}

const files = listFiles(root).filter(f => exts.includes(path.extname(f)));
const importRegex = /import\s+[^'\"]+['\"]([^'\"]+)['\"]/g;
const requireRegex = /require\(['\"]([^'\"]+)['\"]\)/g;

const issues = [];
for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  let m;
  while ((m = importRegex.exec(content)) !== null) {
    issues.push({ file: f, spec: m[1] });
  }
  while ((m = requireRegex.exec(content)) !== null) {
    issues.push({ file: f, spec: m[1] });
  }
}

const results = [];
for (const it of issues) {
  const { file, spec } = it;
  if (!(spec.startsWith('.') || spec.startsWith('..') || spec.startsWith('@/'))) continue;
  let candidate;
  if (spec.startsWith('@/')) {
    candidate = path.join(root, spec.slice(2));
  } else {
    candidate = path.resolve(path.dirname(file), spec);
  }
  let found = false;
  let caseMismatch = null;
  // try file with extensions
  for (const e of exts) {
    const fpath = candidate + e;
    if (fs.existsSync(fpath)) {
      found = true;
      const cs = checkCaseSensitiveParts(fpath);
      if (cs !== true) caseMismatch = cs;
      break;
    }
  }
  // try index
  if (!found) {
    for (const e of exts) {
      const fpath = path.join(candidate, 'index' + e);
      if (fs.existsSync(fpath)) {
        found = true;
        const cs = checkCaseSensitiveParts(fpath);
        if (cs !== true) caseMismatch = cs;
        break;
      }
    }
  }
  if (!found) {
    results.push({ file, spec, issue: 'not found', candidate });
  } else if (caseMismatch) {
    results.push({ file, spec, issue: 'case mismatch', candidate: caseMismatch });
  }
}

console.log('Found', results.length, 'issues');
for (const r of results) console.log(r);

if (results.length > 0) process.exit(2);
else process.exit(0);
