// This plugin provides a proper middleware implementation to avoid useRoute warnings
export default defineNuxtPlugin(() => {
  const router = useRouter();

  // Add a global middleware that passes route parameters correctly
  router.beforeEach((to, from, next) => {
    // This is the proper way to access route information in middleware
    // without using useRoute() which causes warnings

    // You can add your middleware logic here
    // Example: console.log(`Navigating from ${from.path} to ${to.path}`);

    next();
  });
});
