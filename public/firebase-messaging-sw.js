// This a service worker file for receiving push notifitications.
// See `Access registration token section` @ https://firebase.google.com/docs/cloud-messaging/js/client#retrieve-the-current-registration-token

// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');


// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyB3Js8U0dzBEWJPaMWnQwkYqUux_mxXOkw",
  authDomain: "pwa-pushnotification-6b518.firebaseapp.com",
  projectId: "pwa-pushnotification-6b518",
  storageBucket: "pwa-pushnotification-6b518.appspot.com",
  messagingSenderId: "376539431131",
  appId: "1:376539431131:web:901654eacbe9f2999f8cfe",
  measurementId: "G-3NRXFNS8H9"
};


firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

// Handle incoming messages while the app is not in focus (i.e in the background, hidden behind other tabs, or completely closed).
messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
      notificationOptions);
});
