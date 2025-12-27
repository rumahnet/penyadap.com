import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

// Find `.contentlayer/generated/index.mjs` by walking up parent folders so the
// shim still works if the server is started from another CWD (e.g. `dist`)
function findGeneratedIndex(startDir = process.cwd()) {
  let dir = startDir;
  const root = path.parse(dir).root;
  while (true) {
    const candidate = path.join(dir, ".contentlayer", "generated", "index.mjs");
    if (fs.existsSync(candidate)) return candidate;
    if (dir === root) break;
    dir = path.dirname(dir);
  }

  // Fallback: try relative to this file location (handles some bundled cases)
  try {
    const altCandidate = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..", ".contentlayer", "generated", "index.mjs");
    if (fs.existsSync(altCandidate)) return altCandidate;
  } catch (e) {
    // ignore
  }

  return null;
}

let generated = null;

async function loadGenerated() {
  if (!generated) {
    const genIndex = findGeneratedIndex();
    const exists = !!genIndex;

    // Debug: show where we looked and what we found
    // eslint-disable-next-line no-console
    console.debug(`[contentlayer] loadGenerated: cwd=${process.cwd()} genIndex=${genIndex} exists=${exists}`);

    if (exists) {
      // Import the ESM-generated module dynamically
      try {
        const genIndexUrl = pathToFileURL(genIndex).href;
        // eslint-disable-next-line no-console
        console.debug(`[contentlayer] loadGenerated: importing generated module url=${genIndexUrl}`);
        generated = await import(genIndexUrl);
        // eslint-disable-next-line no-console
        console.debug(`[contentlayer] loadGenerated: imported generated module keys=${Object.keys(generated).join(',')}`);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.debug(`[contentlayer] loadGenerated: import failed: ${err && err.message}`);

        // Fallback: try to read the generated JSON indexes directly. This helps
        // in environments where dynamic `import()` with a runtime URL is not
        // allowed or is considered "too dynamic" by the bundler (e.g., Next
        // compile-time tracing). Reading the pre-generated JSON files is a
        // safe alternative and provides the same data shape.
        try {
          const genDir = path.dirname(genIndex);
          const readIndex = (subdir) => {
            const p = path.join(genDir, subdir, '_index.json');
            if (fs.existsSync(p)) {
              // eslint-disable-next-line no-console
              console.debug(`[contentlayer] loadGenerated: reading generated json ${p}`);
              return JSON.parse(fs.readFileSync(p, 'utf8'));
            }
            return [];
          };

          const allPages = readIndex('Page');
          const allDocs = readIndex('Doc');
          const allGuides = readIndex('Guide');
          const allPosts = readIndex('Post');

          generated = { allPages, allDocs, allGuides, allPosts };
          // eslint-disable-next-line no-console
          console.debug(`[contentlayer] loadGenerated: fallback loaded keys=${Object.keys(generated).join(',')}`);
        } catch (err2) {
          // eslint-disable-next-line no-console
          console.debug(`[contentlayer] loadGenerated: fallback failed: ${err2 && err2.message}`);
          generated = null;
        }
      }
    }
  }
  return generated;
}

// Export safe fallbacks for common named exports
const EMPTY = [];

export const allDocs = (await loadGenerated())?.allDocs ?? EMPTY;
export const allPosts = (await loadGenerated())?.allPosts ?? EMPTY;
export const allPages = (await loadGenerated())?.allPages ?? EMPTY;
export const allGuides = (await loadGenerated())?.allGuides ?? EMPTY;

// Export type constructors or placeholders
export const Doc = (await loadGenerated())?.Doc ?? (class {});
export const Post = (await loadGenerated())?.Post ?? (class {});
export const Guide = (await loadGenerated())?.Guide ?? (class {});

export default (await loadGenerated()) ?? { allDocs, allPosts, allPages, allGuides, Doc, Post, Guide };
