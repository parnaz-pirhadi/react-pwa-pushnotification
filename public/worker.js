var CACHE_NAME = "pwa-notification-cache";
const version = "0.0.1"

this.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            //if supervisor not exist , you should change addAll to /offline.html /offline.css /eb0d9c6914c753f76252.ttf
            return cache.addAll([
                "/offline.html",
                "/offline.css",
                "/static/media/Vazirmatn.eb0d9c6914c753f76252.ttf",
                //if you want cache the first page , add "/"
            ])
        })
    )
})
// Inside the service worker’s activate event, delete all previously cached files if necessary
self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (CACHE_NAME !== cacheName && cacheName.startsWith("cache")) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// network first
// self.addEventListener("fetch", function(event) {
//     event.respondWith(
//         fetch(event.request).catch(function() {
//             // console.log("e.request",event.request)
//             return caches.match(event.request).then(function(response) {
//                 if (response) {
//                     return response;
//                 } else if (event.request.headers.get("accept").includes("text/html")) {
//                     return caches.match("offline.html");
//                 }
//             });
//         })
//     );
// });

//cache first
// self.addEventListener( "fetch", event => {
//     const request = event.request;
//
//     // If we are requesting an HTML page.
//     // if ( request.headers.get("Accept").includes("text/html") ) {
//         event.respondWith(
//             // Check the cache first to see if the asset exists, and if it does,
//             // return the cached asset.
//             caches.match( request )
//
//
//                 .then( cached_result => {
//                     if ( cached_result ) {
//                         return cached_result;
//                     }
//                     // If the asset isn't in the cache, fall back to a network request
//                     // for the asset, and proceed to cache the result.
//                     return fetch( request )
//                         .then( response => {
//                             const copy = response.clone();
//                             // Wait until the response we received is added to the cache.
//                             event.waitUntil(
//                                 caches.open( CACHE_NAME )
//                                     .then( cache => {
//                                         return cache.put( request, response );
//                                     })
//                         );
//                             return response;
//                         })
//                         // If the network is unavailable to make a request, pull the offline
//                         // page out of the cache.
//                         .catch(() => caches.match( "/offline.html" ));
//                 })
//         ); // end respondWith
//     // } // end if HTML
// });
self.addEventListener('fetch', event => {
    if (event.request.mode === 'navigate' ||
        (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
        event.respondWith(
            fetch(event.request.url).catch(error => {
                //if supervisor not exist , you should change match to /offline.html

                return caches.match("offline.html");
            })
        );
    } else {
        // if the resources arent in the cache , they are requested from the server
        event.respondWith(caches.match(event.request)
            .then(function (response) {
                return response || fetch(event.request);
            })
        );
    }
});

self.addEventListener('message', (event) => {
    if (event.data === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
