// This plugin handles WebSocket reconnection for content updates
export default defineNuxtPlugin(() => {
  // Only run in client-side and development mode
  if (process.server || process.env.NODE_ENV !== "development") {
    return;
  }

  // Keep track of reconnection attempts
  let reconnectAttempts = 0;
  const maxReconnectAttempts = 5;
  const reconnectInterval = 2000; // 2 seconds - faster reconnection

  // Track WebSocket connection status
  let isConnected = false;
  let reconnectTimer: number | null = null;

  // Function to handle WebSocket reconnection
  function handleWebSocketReconnect(): void {
    // Clear any existing reconnect timer
    if (reconnectTimer !== null) {
      clearTimeout(reconnectTimer);
    }

    // Check if we've exceeded the maximum number of reconnection attempts
    if (reconnectAttempts >= maxReconnectAttempts) {
      // eslint-disable-next-line no-console
      console.warn("Maximum WebSocket reconnection attempts reached. Reloading page...");
      window.location.reload();
      return;
    }

    // Increment the reconnection attempts counter
    reconnectAttempts++;

    // Log the reconnection attempt
    // eslint-disable-next-line no-console
    console.log(
      `WebSocket connection failed (attempt ${reconnectAttempts}/${maxReconnectAttempts})...`,
    );

    // Set a timer to try reconnecting
    reconnectTimer = window.setTimeout(() => {
      // After 3 attempts, try reloading the page
      if (reconnectAttempts >= 3) {
        // eslint-disable-next-line no-console
        console.log("Reloading page to re-establish connections...");
        window.location.reload();
      } else {
        // Try to reconnect by requesting a new content update
        fetch("/api/_content/cache?_=" + Date.now()).catch(() => {
          // Ignore errors - this is just to trigger a reconnection attempt
        });
      }
    }, reconnectInterval);
  }

  // Create a custom WebSocket connection to monitor content updates
  function setupContentWebSocket(): WebSocket | null {
    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.hostname}:4000`;

      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        // eslint-disable-next-line no-console
        console.log("Content WebSocket connected");
        isConnected = true;
        reconnectAttempts = 0; // Reset reconnect attempts on successful connection
      };

      socket.onclose = () => {
        // eslint-disable-next-line no-console
        console.log("Content WebSocket disconnected");
        isConnected = false;
        handleWebSocketReconnect();
      };

      socket.onerror = (error) => {
        // eslint-disable-next-line no-console
        console.error("Content WebSocket error:", error);
        if (isConnected) {
          isConnected = false;
          handleWebSocketReconnect();
        }
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "content:update") {
            // eslint-disable-next-line no-console
            console.log("Content update detected via WebSocket");
            window.location.reload();
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error("Error parsing WebSocket message:", e);
        }
      };

      return socket;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error setting up content WebSocket:", error);
      return null;
    }
  }

  // Set up the WebSocket connection
  const socket = setupContentWebSocket();

  // Clean up the WebSocket connection when the page is unloaded
  window.addEventListener("beforeunload", () => {
    if (socket) {
      socket.close();
    }
    if (reconnectTimer !== null) {
      clearTimeout(reconnectTimer);
    }
  });
});
