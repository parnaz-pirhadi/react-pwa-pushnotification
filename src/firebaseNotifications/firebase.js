// Firebase Cloud Messaging Configuration File.
// Read more at https://firebase.google.com/docs/cloud-messaging/js/client && https://firebase.google.com/docs/cloud-messaging/js/receive

import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyB3Js8U0dzBEWJPaMWnQwkYqUux_mxXOkw",
    authDomain: "pwa-pushnotification-6b518.firebaseapp.com",
    projectId: "pwa-pushnotification-6b518",
    storageBucket: "pwa-pushnotification-6b518.appspot.com",
    messagingSenderId: "376539431131",
    appId: "1:376539431131:web:901654eacbe9f2999f8cfe",
    measurementId: "G-3NRXFNS8H9"
};

initializeApp(firebaseConfig);

const messaging = getMessaging();

export const requestForToken = () => {
    // The method getToken(): Promise<string> allows FCM to use the VAPID key credential
    // when sending message requests to different push services
    return getToken(messaging, { vapidKey: `BJDlFDwWingEqHCk7d8jppFqK-r6cVv9QEZpG8zZHx1n6uLGk4WGfTEIhqjDjLW_hsSAl3JZXI731kLtWFXoujU` }) //to authorize send requests to supported web push services
        .then((currentToken) => {
            if (currentToken) {
                console.log('current token for client: ', currentToken);

                if(localStorage.getItem('fcmToken') && currentToken !==localStorage.getItem('fcmToken')){
                    localStorage.setItem('fcmToken', currentToken);

                }

                else if(!localStorage.getItem('fcmToken')){
                    localStorage.setItem('fcmToken', currentToken);

                }


            } else {
                console.log('No registration token available. Request permission to generate one.');
            }
        })
        .catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
        });
};

// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker `messaging.onBackgroundMessage` handler.
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });


