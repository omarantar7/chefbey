// // stores/auth.ts
// import { defineStore } from "pinia";
// import { signInWithEmailAndPassword, signOut, type User } from "firebase/auth";

// export const useAuthStore = defineStore("auth", {
//   state: () => ({
//     user: null as User | null,
//     loading: true,
//   }),

//   getters: {
//     isAuthenticated: (state) => !!state.user,
//   },

//   actions: {
//     async login(email: string, password: string) {
//       try {
//         const { $auth } = useNuxtApp();
//         if (!$auth) {
//           throw new Error("Firebase auth is not initialized");
//         }
//         const userCredential = await signInWithEmailAndPassword(
//           $auth as any,
//           email,
//           password,
//         );
//         this.user = userCredential.user;
//         return { success: true };
//       } catch (error: any) {
//         console.error("Login error:", error);
//         return { success: false, error: error.message };
//       }
//     },

//     async logout() {
//       try {
//         const { $auth } = useNuxtApp();
//         if (!$auth) {
//           throw new Error("Firebase auth is not initialized");
//         }
//         await signOut($auth as any);
//         this.user = null;
//         navigateTo("/admin/login");
//       } catch (error) {
//         console.error("Logout error:", error);
//       }
//     },
//   },
// });
