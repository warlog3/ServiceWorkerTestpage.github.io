const cacheName = 'v1';

const cacheAssets=[
  'index.html',
  'about.html',
  '/css/style.css',
  '/js/main.js'
];

//Call install event
self.addEventListener('install', event => {
  console.log("Service Worker: Installiert");

  event.waitUntil(
    caches
      .open(cacheName)
        .then(cache => {
          console.log("Service Worker: Caching files...");
          cache.addAll(cacheAssets);
        })
        .then(() => self.skipWaiting())
  );
});

//Call activate event
self.addEventListener('activate', event => {
  console.log("Service Worker: Aktiviert");
  //Remove unwanted caches
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if(cache !== cacheName){
            console.log("Service Worker clearing old Cache");
            return caches.delete(cache);
          }
        })
      )
    }) 
  ) 
})

//Call fetch event
self.addEventListener('fetch', event => {
  console.log("Service Worker: Fetching");
  event.respondWith(
    fetch(event.request).catch( () => {caches.match(event.request)})
  );
})