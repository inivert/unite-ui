export default defineAppConfig({
  // Increase the default timeout for all fetch requests
  nuxtHttpDefaults: {
    timeout: 60000, // 60 seconds
    retry: 3,
  },
});
