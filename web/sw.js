// Service Worker：离线缓存（排盘为纯本地计算，缓存后断网也能使用）
// 更新代码后重新部署时，把 CACHE_NAME 的版本号加一即可让客户端刷新缓存
var CACHE_NAME = "liuyaopaipan-v1";

var ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/style.css",
  "./js/jieqi_data.js",
  "./js/sizhu.js",
  "./js/shensha.js",
  "./js/bagua.js",
  "./js/output.js",
  "./js/app.js",
  "./img/header.jpg",
  "./img/lx.jpg",
  "./img/sk.jpg",
  "./img/icon-192.png",
  "./img/icon-512.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (c) { return c.addAll(ASSETS); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.map(function (k) {
          if (k !== CACHE_NAME) { return caches.delete(k); }
        }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

// 缓存优先；联网时顺带更新缓存，离线时回退缓存
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") { return; }
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(function (hit) {
      if (hit) { return hit; }
      return fetch(e.request).then(function (resp) {
        var copy = resp.clone();
        caches.open(CACHE_NAME).then(function (c) { c.put(e.request, copy); });
        return resp;
      });
    }).catch(function () {
      if (e.request.mode === "navigate") { return caches.match("./index.html"); }
    })
  );
});
