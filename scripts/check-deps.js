const fs = require('fs');
const path = require('path');
const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
const exts = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.json'];

function list(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (p.includes('node_modules') || p.includes('.next') || p.includes('.git')) return [];
      return list(p);
    }
    return [p];
  });
}

const files = list(root).filter(f => exts.includes(path.extname(f)));
const importRE = /import\s+[^'\"]+['\"]([^'\"]+)['\"]/g;
const reqRE = /require\(['\"]([^'\"]+)['\"]\)/g;
const externals = new Set();
for (const f of files) {
  const text = fs.readFileSync(f, 'utf8');
  let m;
  while ((m = importRE.exec(text)) !== null) {
    const s = m[1];
    if (!s.startsWith('.') && !s.startsWith('@/')) externals.add(s.split('/')[0]);
  }
  while ((m = reqRE.exec(text)) !== null) {
    const s = m[1];
    if (!s.startsWith('.') && !s.startsWith('@/')) externals.add(s.split('/')[0]);
  }
}

const missing = [...externals].filter(e => !deps[e]);
console.log('external imports count', externals.size);
if (missing.length) {
  console.log('missing deps:', missing);
  process.exit(2);
} else {
  console.log('all external imports present');
}
