export default defineEventHandler((event) => {
  // Add CORS headers for WebSocket connections
  if (event.path.includes("/_nuxt/") || event.path.includes("/_hmr/")) {
    event.node.res.setHeader("Access-Control-Allow-Origin", "*");
    event.node.res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    event.node.res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Handle preflight requests
    if (event.method === "OPTIONS") {
      event.node.res.statusCode = 204;
      event.node.res.end();
      return;
    }
  }
});
