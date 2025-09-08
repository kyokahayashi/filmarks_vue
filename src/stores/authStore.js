import { auth } from '@/firebase/config';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    loading: false,
    error: null
  }),
  actions: {
    async register(email, password) {
      this.loading = true;
      this.error = null;
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        this.user = userCredential.user;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async login(email, password) {
      this.loading = true;
      this.error = null;
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        this.user = userCredential.user;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      try {
        await signOut(auth);
        this.user = null;
      } catch (err) {
        this.error = err.message;
      }
    },
    initAuth() {
      onAuthStateChanged(auth, (user) => {
        this.user = user;
      });
    }
  },
});
