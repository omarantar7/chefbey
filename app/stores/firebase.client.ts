// // plugins/firebase.client.ts
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import type { FirebaseOptions } from "firebase/app";

// export default defineNuxtPlugin(() => {
//   const config = useRuntimeConfig();

//   const firebaseConfig: FirebaseOptions = {
//     apiKey: config.public.firebaseApiKey as string,
//     authDomain: config.public.firebaseAuthDomain as string,
//     projectId: config.public.firebaseProjectId as string,
//     storageBucket: config.public.firebaseStorageBucket as string,
//     messagingSenderId: config.public.firebaseMessagingSenderId as string,
//     appId: config.public.firebaseAppId as string,
//   };

//   const app = initializeApp(firebaseConfig);
//   const auth = getAuth(app);

//   return {
//     provide: {
//       auth,
//     },
//   };
// });
