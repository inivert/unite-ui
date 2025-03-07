/**
 * Script to fix case-sensitivity issues in imports and file paths
 * This script is run before the build process to ensure consistent paths on case-sensitive file systems
 */
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// Directories to search in
const SEARCH_DIRS = ["components", "pages", "layouts"];

// Case-sensitivity replacements
const REPLACEMENTS = [
  { from: /EXamples/g, to: "examples" },
  { from: /\/UI\//g, to: "/ui/" },
  { from: /\/Matter\//g, to: "/matter/" },
  { from: /\/M-Cards\//g, to: "/m-cards/" },
  { from: /liquidcard\.vue/g, to: "LiquidCard.vue" },
];

/**
 * Recursively find all Vue and TS files in a directory
 * @param {string} dir - Directory to search
 * @param {string[]} fileList - Accumulator for found files
 * @returns {string[]} - List of file paths
 */
function findFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;

  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findFiles(filePath, fileList);
    } else if (file.endsWith(".vue") || file.endsWith(".ts")) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Fix imports in a file
 * @param {string} filePath - Path to the file
 * @returns {boolean} - Whether the file was modified
 */
function fixImports(filePath) {
  try {
    // eslint-disable-next-line no-console
    console.log(`Checking ${filePath}`);
    let content = fs.readFileSync(filePath, "utf8");
    let modified = false;

    // Apply all replacements
    REPLACEMENTS.forEach(({ from, to }) => {
      if (content.match(from)) {
        // eslint-disable-next-line no-console
        console.log(`  - Replacing '${from}' with '${to}' in ${filePath}`);
        content = content.replace(from, to);
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content);
      // eslint-disable-next-line no-console
      console.log(`  ✓ Fixed imports in ${filePath}`);
      return true;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error processing ${filePath}:`, error);
  }

  return false;
}

/**
 * Main function
 */
function main() {
  // eslint-disable-next-line no-console
  console.log("Starting to fix case-sensitivity issues...");

  let allFiles = [];
  SEARCH_DIRS.forEach((dir) => {
    const files = findFiles(dir);
    allFiles = allFiles.concat(files);
  });

  // eslint-disable-next-line no-console
  console.log(`Found ${allFiles.length} files to check`);

  let fixedCount = 0;
  allFiles.forEach((file) => {
    if (fixImports(file)) {
      fixedCount++;
    }
  });

  // eslint-disable-next-line no-console
  console.log(`\nFixed imports in ${fixedCount} files`);

  // eslint-disable-next-line no-console
  console.log("\nDone!");
}

// Run the main function
main();
