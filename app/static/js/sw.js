importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');


workbox.loadModule('workbox-strategies');

workbox.routing.registerRoute(
    new RegExp('/.*/'),
    new workbox.strategies.NetworkFirst()
);

self.addEventListener('message', function (event) {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});