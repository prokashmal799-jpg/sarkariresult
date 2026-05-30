// SARKARI ALERTS - Dynamic Service Worker for Real-time Web Notifications
const CACHE_NAME = "sarkari-alerts-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/src/main.tsx",
  "/src/index.css",
  "/src/App.tsx"
];

// 1. Service Worker Installation - Precache crucial static files for instant performance load
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Precaching critical static assets...");
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn("[Service Worker] Precaching skipped or assets unavailable: ", err);
      });
    })
  );
  // Force active state directly
  self.skipWaiting();
});

// 2. Activation - Clean up deprecated legacy caches safely
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[Service Worker] Removing deprecated cache index: ", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  // Absorb active operations
  self.clients.claim();
});

// 3. Dynamic Fetch Interceptor - Serve cached files when offline, or route straight to network
self.addEventListener("fetch", (event) => {
  // Only intercept local HTTP/S GET records
  if (event.request.method !== "GET" || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return resource from sandboxed cache index
        return cachedResponse;
      }

      // Fetch from actual active browser network
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
          return networkResponse;
        }

        // Cache the dynamically fetched local asset for subsequent load boosts
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Safe offline fallback in case connection is completely dropped
        if (event.request.headers.get("accept").includes("text/html")) {
          return caches.match("/");
        }
      });
    })
  );
});

// 4. Live Broadcast Signal Dispatcher (Web Push Simulation & Real Web API events)
// This handler listens for manual "postMessage" updates from the React application context or true Web push events
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SEND_NOTIFICATION") {
    const { title, body, category, url } = event.data.payload;
    console.log("[Service Worker] Live local action intercepted: Received broadcast dispatch trigger", { title, category });

    const options = {
      body: body,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      vibrate: [200, 100, 200, 100, 300], // Premium multi-pulse attention vibration
      data: {
        category: category,
        url: url || "/",
        timestamp: Date.now()
      },
      tag: "sarkari-alert-" + category.toLowerCase().replace(" ", "-"),
      actions: [
        { action: "explore", title: "🔍 Browse Alerts", icon: "" },
        { action: "close", title: "✕ Dismiss", icon: "" }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(`🔔 [${category}] ${title}`, options)
    );
  }
});

// 4b. Real Background Push Event Listener (Runs when server-side VAPID pushes are triggered)
self.addEventListener("push", (event) => {
  let data = { title: "New Job Alert!", body: "A new Sarkari vacancy has been announced.", category: "Central Jobs" };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: "New Government Job Live!", body: event.data.text() || "", category: "Central Jobs" };
    }
  }

  console.log("[Service Worker] True background push received:", data);

  const options = {
    body: data.body,
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    vibrate: [100, 50, 100],
    data: {
      url: data.url || "/",
      category: data.category
    },
    tag: "sarkari-background-push",
    actions: [
      { action: "explore", title: "🔍 Check Vacancy" }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 5. Native System Device Banner Selection Trigger - When user hits action button or notification card
self.addEventListener("notificationclick", (event) => {
  console.log("[Service Worker] Notification panel interaction clicked. Action:", event.action);
  
  event.notification.close(); // Automatically dismiss active card

  if (event.action === "close") {
    return;
  }

  // Handle client focus/redirect to home portal url
  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // If a tab is already open, focus it and redirect to targeted page
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.postMessage({ type: "NAVIGATE_ROUTE", url: targetUrl });
          return client.focus();
        }
      }
      // If no tab is open, launch a new browser window
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
