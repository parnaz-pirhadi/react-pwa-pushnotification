// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read https://bit.ly/CRA-PWA


import {toast} from 'react-toastify';
import InfoIcon from "./assets/svg/InfoIcon"


const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

export function register(config) {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
        // The URL constructor is available in all browsers that support SW.
        const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
        if (publicUrl.origin !== window.location.origin) {
            // Our service worker won't work if PUBLIC_URL is on a different origin
            // from what our page is served on. This might happen if a CDN is used to
            // serve assets; see https://github.com/facebook/create-react-app/issues/2374
            return;
        }

        window.addEventListener('load', () => {
            const swUrl = `/worker.js`;
            console.log("swUrl", swUrl)

            if (isLocalhost) {
                // This is running on localhost. Let's check if a service worker still exists or not.
                checkValidServiceWorker(swUrl, config);

                // Add some additional logging to localhost, pointing developers to the
                // service worker/PWA documentation.
                navigator.serviceWorker.ready.then(() => {
                    console.log(
                        'This web app is being served cache-first by a service ' +
                        'worker. To learn more, visit https://bit.ly/CRA-PWA'
                    );
                });

                // // Then later, request a one-off sync:
                // navigator.serviceWorker.ready.then(function (swRegistration) {
                //     return swRegistration.sync.register('myFirstSync');
                // });

            } else {
                // Is not localhost. Just register service worker
                registerValidSW(swUrl, config);
            }
            let refreshing = false;

            // detect controller change and refresh the page
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (!refreshing) {
                    window.location.reload(true)
                    refreshing = true
                }
            })
        });

    }
}

function invokeServiceWorkerUpdateFlow(registration) {
    var pjson = require('../package.json');
    console.log(pjson.version);
    toast.info(`Application services improved ${pjson.version} `, {
        toastId: "appUpdateAvailable", // Prevent duplicate toasts
        onClick: () => {
            if (registration.waiting) {
                // let waiting Service Worker know it should became active
                registration.waiting.postMessage('SKIP_WAITING')
            }
        }, // Closes windows on click
        autoClose: false,// Prevents toast from auto closing
        icon: <InfoIcon />
    });

}

function registerValidSW(swUrl, config) {
    navigator.serviceWorker
        .register(swUrl)
        .then(registration => {
            // Check for updates at start.
            registration.update();
            // Check for updates every min.
            setInterval(() => {
                registration.update();
            }, (1000 * 60));

            // ensure the case when the updatefound event was missed is also handled
            // by re-invoking the prompt when there's a waiting Service Worker
            if (registration.waiting) {
                invokeServiceWorkerUpdateFlow(registration)
            }

            // detect Service Worker update available and wait for it to become installed
            registration.onupdatefound = () => {
                const installingWorker = registration.installing;
                if (installingWorker == null) {
                    return;
                }
                // wait until the new Service worker is actually installed (ready to take over)
                installingWorker.onstatechange = () => {
                    if (registration.waiting) {
                        if (navigator.serviceWorker.controller) {
                            // if there's an existing controller (previous Service Worker), show the prompt
                            invokeServiceWorkerUpdateFlow(registration)
                            console.log(
                                'New assets is available and will be used when all ' +
                                'tabs for this page are closed. See https://bit.ly/CRA-PWA'
                            );

                            // Execute callback
                            if (config && config.onUpdate) {
                                config.onUpdate(registration);
                            }
                        } else {
                            // At this point, everything has been precached.
                            // It's the perfect time to display a
                            // "Index is cached for offline use." message.
                            console.log('Index is cached for offline use.');

                            // Execute callback
                            if (config && config.onSuccess) {
                                console.log("if (config && config.onSuccess) {")
                                config.onSuccess(registration);
                            }
                        }
                    }
                };
            };
        })
        .catch(error => {
            console.error('Error during service worker registration:', error);
        });
}

function checkValidServiceWorker(swUrl, config) {
    // Check if the service worker can be found. If it can't reload the page.
    fetch(swUrl, {
        headers: {'Service-Worker': 'script'},
    })
        .then(response => {
            // Ensure service worker exists, and that we really are getting a JS file.
            const contentType = response.headers.get('content-type');
            if (
                response.status === 404 ||
                (contentType != null && contentType.indexOf('javascript') === -1)
            ) {
                // No service worker found. Probably a different app. Reload the page.
                navigator.serviceWorker.ready.then(registration => {
                    registration.unregister().then(() => {
                        window.location.reload();
                    });
                });
            } else {
                // Service worker found. Proceed as normal.
                registerValidSW(swUrl, config);
            }
        })
        .catch(() => {
            console.log(
                'No internet connection found. App is running in offline mode.'
            );
        });
}

export function unregister() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
            .then(registration => {
                registration.unregister();
            })
            .catch(error => {
                console.error(error.message);
            });
    }
}
