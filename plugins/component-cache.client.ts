import { defineNuxtPlugin } from "#app";

/**
 * Plugin to cache viewed components in localStorage
 * This improves subsequent loads without requiring a refresh
 */
export default defineNuxtPlugin((nuxtApp) => {
  // Only run in client-side
  if (import.meta.server) return;

  const CACHE_VERSION = "1.0.0";
  const CACHE_PREFIX = "unite-ui-component-cache:";
  const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

  // Create a Map to store components that have been loaded in the current session
  const loadedComponents = new Map();

  // Function to get cached component
  function getCache(key: string) {
    try {
      const cacheKey = `${CACHE_PREFIX}${key}`;
      const cachedData = localStorage.getItem(cacheKey);

      if (!cachedData) return null;

      const { data, version, timestamp } = JSON.parse(cachedData);

      // Check if cache is expired or version mismatch
      if (version !== CACHE_VERSION || Date.now() - timestamp > CACHE_EXPIRY) {
        localStorage.removeItem(cacheKey);
        return null;
      }

      return data;
    } catch (error) {
      // Error retrieving from cache
      return null;
    }
  }

  // Function to set cache
  function setCache(key: string, data: unknown) {
    try {
      const cacheKey = `${CACHE_PREFIX}${key}`;
      const cacheData = {
        data,
        version: CACHE_VERSION,
        timestamp: Date.now(),
      };

      localStorage.setItem(cacheKey, JSON.stringify(cacheData));

      // Also store in memory for current session
      loadedComponents.set(key, data);
    } catch (error) {
      // Error setting cache
    }
  }

  // Function to check if component is in memory cache
  function isInMemoryCache(key: string) {
    return loadedComponents.has(key);
  }

  // Add cache helpers to nuxtApp
  nuxtApp.provide("componentCache", {
    get: getCache,
    set: setCache,
    isLoaded: isInMemoryCache,
  });

  // Clean up old cache entries on app start
  function cleanupCache() {
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(CACHE_PREFIX)) {
          try {
            const { timestamp, version } = JSON.parse(localStorage.getItem(key) || "{}");
            if (version !== CACHE_VERSION || Date.now() - timestamp > CACHE_EXPIRY) {
              localStorage.removeItem(key);
            }
          } catch (e) {
            localStorage.removeItem(key);
          }
        }
      });
    } catch (error) {
      // Error cleaning cache
    }
  }

  // Run cleanup on app start
  cleanupCache();
});
