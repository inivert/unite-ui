// This plugin has been disabled to prevent WebSocket reconnection attempts
/*
export default defineNuxtPlugin(() => {
  // Only run in client-side and development mode
  if (process.server || process.env.NODE_ENV !== 'development') {
    return;
  }

  // Keep track of reconnection attempts
  let reconnectAttempts = 0;
  const maxReconnectAttempts = 5;
  const reconnectInterval = 3000; // 3 seconds

  // Function to handle WebSocket reconnection
  const handleWebSocketReconnect = () => {
    // Check if we've exceeded the maximum number of reconnection attempts
    if (reconnectAttempts >= maxReconnectAttempts) {
      console.warn('Maximum WebSocket reconnection attempts reached. Giving up.');
      return;
    }

    // Increment the reconnection attempts counter
    reconnectAttempts++;

    // Log the reconnection attempt
    console.log(`WebSocket connection failed (attempt ${reconnectAttempts}/${maxReconnectAttempts})...`);

    // After 3 attempts, try reloading the page
    if (reconnectAttempts >= 3) {
      console.log('Reloading page to re-establish connections...');
      window.location.reload();
    }
  };

  // Listen for WebSocket connection errors
  window.addEventListener('error', (event) => {
    if (event.message && event.message.includes('WebSocket connection to')) {
      handleWebSocketReconnect();
    }
  });
});
*/
