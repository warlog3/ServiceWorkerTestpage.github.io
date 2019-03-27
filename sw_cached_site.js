const cacheName = 'v2';

const cacheAssets=[
  'index.html',
  'about.html',
  '/css/style.css',
  '/js/main.js'
];

//Call install event
self.addEventListener('install', event => {
  console.log("Service Worker: Installiert");
});

//Call activate event
self.addEventListener('activate', event => {
  console.log("Service Worker: Aktiviert");

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
    fetch(event.request)
      .then( res => {
        //Make copy clone of response
        const resClone = res.clone();

        caches
          .open(cacheName)
            .then(cache => {
              //Add response to cache 
              cache.put(event.request, resClone);
            })
            return res;
      }).catch( err => caches.match(event.request).then( res => res ))
    );
})