// plugins/firebase.client.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default defineNuxtPlugin((nuxtApp) => {
  // Your Firebase configuration object
  const config = {
    apiKey: "AIzaSyAKtkiWL_OB0_Pgv2CelUcdg1rfH3s3J8U",
    authDomain: "react-auth-3b48c.firebaseapp.com",
    projectId: "react-auth-3b48c",
    storageBucket: "react-auth-3b48c.firebasestorage.app",
    messagingSenderId: "640276695143",
    appId: "1:640276695143:web:a1a916596e50e468b06cc2",
  };

  // Initialize Firebase
  const app = initializeApp(config);

  // Initialize Services
  const db = getFirestore(app);
  const auth = getAuth(app);

  // Provide to Nuxt app
  return {
    provide: {
      firebase: app,
      db,
      auth,
    },
  };
});
