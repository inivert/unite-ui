// Script to fix case-sensitivity issues in imports and file paths
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Function to recursively find all Vue files
function findVueFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findVueFiles(filePath, fileList);
    } else if (file.endsWith(".vue") || file.endsWith(".ts")) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Function to fix imports in a file
function fixImportsInFile(filePath) {
  console.log(`Checking imports in ${filePath}`);
  let content = fs.readFileSync(filePath, "utf8");
  let modified = false;

  // Fix EXamples to examples
  if (content.includes("EXamples")) {
    console.log(`  - Fixing EXamples imports in ${filePath}`);
    content = content.replace(/EXamples/g, "examples");
    modified = true;
  }

  // Fix UI to ui
  if (content.includes("/UI/")) {
    console.log(`  - Fixing UI imports in ${filePath}`);
    content = content.replace(/\/UI\//g, "/ui/");
    modified = true;
  }

  // Fix Matter to matter
  if (content.includes("/Matter/")) {
    console.log(`  - Fixing Matter imports in ${filePath}`);
    content = content.replace(/\/Matter\//g, "/matter/");
    modified = true;
  }

  // Fix M-Cards to m-cards
  if (content.includes("/M-Cards/")) {
    console.log(`  - Fixing M-Cards imports in ${filePath}`);
    content = content.replace(/\/M-Cards\//g, "/m-cards/");
    modified = true;
  }

  // Fix liquidcard.vue to LiquidCard.vue
  if (content.includes("liquidcard.vue")) {
    console.log(`  - Fixing liquidcard.vue imports in ${filePath}`);
    content = content.replace(/liquidcard\.vue/g, "LiquidCard.vue");
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`  ✓ Fixed imports in ${filePath}`);
    return true;
  }

  return false;
}

// Main function
async function main() {
  console.log("Starting to fix case-sensitivity issues...");

  // Find all Vue and TS files
  const vueFiles = findVueFiles("components");
  console.log(`Found ${vueFiles.length} Vue/TS files to check`);

  // Fix imports in all files
  let fixedCount = 0;
  vueFiles.forEach((file) => {
    if (fixImportsInFile(file)) {
      fixedCount++;
    }
  });

  console.log(`\nFixed imports in ${fixedCount} files`);

  // Stage changes
  try {
    execSync("git add .");
    console.log("Changes staged successfully");
  } catch (error) {
    console.error("Error staging changes:", error);
  }

  console.log("\nDone! You can now commit the changes and try to build again.");
}

// Run the main function
main().catch((error) => {
  console.error("Error:", error);
});
