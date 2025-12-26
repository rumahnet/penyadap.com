import fs from "fs";
import path from "path";

const genIndex = path.resolve(process.cwd(), ".contentlayer", "generated", "index.mjs");
let generated = null;

async function loadGenerated() {
  if (!generated && fs.existsSync(genIndex)) {
    // Import the ESM-generated module dynamically
    try {
      generated = await import(`file://${genIndex}`);
    } catch (err) {
      // ignore
      generated = null;
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
