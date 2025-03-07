/**
 * Composable for component caching
 * Use this to cache and retrieve component data
 */
export function useComponentCache() {
  const nuxtApp = useNuxtApp()
  const componentCache = nuxtApp.$componentCache
  
  /**
   * Get component data from cache
   * @param key - Unique identifier for the component
   * @returns Cached data or null if not found
   */
  const getFromCache = (key: string) => {
    // Only use cache in client-side
    if (process.server) return null
    
    return componentCache?.get(key) || null
  }
  
  /**
   * Save component data to cache
   * @param key - Unique identifier for the component
   * @param data - Data to cache
   */
  const saveToCache = (key: string, data: any) => {
    // Only cache in client-side
    if (process.server) return
    
    componentCache?.set(key, data)
  }
  
  /**
   * Check if component is already loaded in current session
   * @param key - Unique identifier for the component
   * @returns Boolean indicating if component is loaded
   */
  const isComponentLoaded = (key: string) => {
    // Always false on server-side
    if (process.server) return false
    
    return componentCache?.isLoaded(key) || false
  }
  
  return {
    getFromCache,
    saveToCache,
    isComponentLoaded
  }
} 