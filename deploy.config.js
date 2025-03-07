/**
 * Deployment configuration for Unite UI
 *
 * This configuration follows the shad-deploy documentation standards
 */
module.exports = {
  // Application name
  name: "unite-ui",

  // Deployment environment
  environment: process.env.NODE_ENV || "production",

  // Docker configuration
  docker: {
    // Use the Dockerfile in the root directory
    dockerfile: "./Dockerfile",

    // Docker image name
    imageName: "unite-ui",

    // Docker build arguments
    buildArgs: {
      NODE_ENV: "production",
    },

    // Docker run options
    runOptions: {
      ports: ["3000:3000"],
      env: {
        NODE_ENV: "production",
      },
    },
  },

  // Build configuration
  build: {
    // Command to build the application
    command: "pnpm run build",

    // Output directory
    outputDir: ".output",

    // Files to include in the deployment
    include: [".output/**/*", "public/**/*"],

    // Files to exclude from the deployment
    exclude: ["node_modules", ".git", ".github", "tests", "**/*.test.js", "**/*.spec.js"],
  },

  // Deployment hooks
  hooks: {
    // Before build
    beforeBuild: [
      // Fix case-sensitivity issues before building
      "node scripts/fix-case-sensitivity.js",
    ],

    // After build
    afterBuild: [],

    // Before deploy
    beforeDeploy: [],

    // After deploy
    afterDeploy: [],
  },
};
