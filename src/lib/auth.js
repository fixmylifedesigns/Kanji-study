// src/lib/auth.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { Capacitor } from "@capacitor/core";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export class AuthService {
  constructor() {
    this.isNative = Capacitor.isNativePlatform();
  }

  /**
   * Sign in with Google
   * Uses native authentication on mobile, web authentication in browser
   */
  async signInWithGoogle() {
    try {
      if (this.isNative) {
        // Mobile authentication flow
        await FirebaseAuthentication.signOut();
        const result = await FirebaseAuthentication.signInWithGoogle();
        return result;
      } else {
        // Web authentication flow
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        return result;
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error;
    }
  }

  /**
   * Sign in with email/password
   * @param {string} email User's email
   * @param {string} password User's password
   */
  async signInWithEmail(email, password) {
    try {
      if (this.isNative) {
        await FirebaseAuthentication.signInWithEmailAndPassword({ email, password });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      console.error("Email sign-in error:", error);
      throw error;
    }
  }

  /**
   * Create a new user account
   * @param {string} email User's email
   * @param {string} password User's password
   */
  async createAccount(email, password) {
    try {
      if (this.isNative) {
        await FirebaseAuthentication.createUserWithEmailAndPassword({ email, password });
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      console.error("Account creation error:", error);
      throw error;
    }
  }

  /**
   * Sign out the current user
   */
  async signOut() {
    try {
      if (this.isNative) {
        await FirebaseAuthentication.signOut();
      } else {
        await signOut(auth);
      }
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  }

  /**
   * Initialize authentication state listener
   * @param {Function} callback Function to call when auth state changes
   */
  initAuthStateListener(callback) {
    if (this.isNative) {
      FirebaseAuthentication.addListener('authStateChange', callback);
    } else {
      return onAuthStateChanged(auth, callback);
    }
  }

  /**
   * Get the current user
   * @returns {Promise<Object|null>} Current user object or null
   */
  async getCurrentUser() {
    if (this.isNative) {
      const result = await FirebaseAuthentication.getCurrentUser();
      return result.user;
    } else {
      return auth.currentUser;
    }
  }
}

export const authService = new AuthService();