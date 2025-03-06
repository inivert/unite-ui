export default defineEventHandler((event) => {
  // Add Last-Modified header to all responses
  event.node.res.setHeader("Last-Modified", new Date().toUTCString());
});
