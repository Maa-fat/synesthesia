const CACHE_NAME = "app-v2";

self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if(key !== CACHE_NAME){
            return caches.delete(key); // 古い削除
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {

        // ✅ 最新をキャッシュに保存
        let resClone = response.clone();

        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, resClone);
        });

        return response;
      })
      .catch(() => {
        // ✅ オフライン時だけキャッシュ使う
        return caches.match(event.request);
      })
  );
});
``