// Script to fix import paths in all Vue and TS files
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Directories to search in
const searchDirs = ["components", "pages", "layouts"];

// Function to recursively find all Vue and TS files
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

// Function to fix imports in a file
function fixImports(filePath) {
  try {
    console.log(`Checking ${filePath}`);
    let content = fs.readFileSync(filePath, "utf8");
    let modified = false;

    // Fix EXamples to examples
    if (content.includes("EXamples")) {
      console.log(`  - Found 'EXamples' in ${filePath}`);
      content = content.replace(/EXamples/g, "examples");
      modified = true;
    }

    // Fix other case-sensitivity issues
    const replacements = [
      { from: /\/UI\//g, to: "/ui/" },
      { from: /\/Matter\//g, to: "/matter/" },
      { from: /\/M-Cards\//g, to: "/m-cards/" },
      { from: /liquidcard\.vue/g, to: "LiquidCard.vue" },
    ];

    replacements.forEach(({ from, to }) => {
      if (content.match(from)) {
        console.log(`  - Replacing '${from}' with '${to}' in ${filePath}`);
        content = content.replace(from, to);
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`  ✓ Fixed imports in ${filePath}`);
      return true;
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }

  return false;
}

// Main function
function main() {
  console.log("Starting to fix import paths...");

  let allFiles = [];
  searchDirs.forEach((dir) => {
    const files = findFiles(dir);
    allFiles = allFiles.concat(files);
  });

  console.log(`Found ${allFiles.length} files to check`);

  let fixedCount = 0;
  allFiles.forEach((file) => {
    if (fixImports(file)) {
      fixedCount++;
    }
  });

  console.log(`\nFixed imports in ${fixedCount} files`);

  if (fixedCount > 0) {
    try {
      execSync("git add .");
      console.log("Changes staged successfully");
    } catch (error) {
      console.error("Error staging changes:", error);
    }
  }

  console.log("\nDone!");
}

// Run the main function
main();
