const path = require('path');
const fs = require('fs');
(async function () {
  const genIndex = path.resolve(process.cwd(), '.contentlayer', 'generated', 'index.mjs');
  console.log('genIndex exists:', fs.existsSync(genIndex));
  try {
    const { pathToFileURL } = require('url');
    const genIndexUrl = pathToFileURL(genIndex).href;
    console.log('importing', genIndexUrl);
    const mod = await import(genIndexUrl);
    console.log('mod keys:', Object.keys(mod));
    console.log('allPosts length:', (mod.allPosts || []).length);
  } catch (err) {
    console.error('import error:', err && err.message);
  }
})();
