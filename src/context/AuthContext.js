"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { Capacitor } from "@capacitor/core";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { auth } from "@/lib/firebase";

// Create LoadingBar component
const LoadingBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 10;
        return next > 90 ? 90 : next;
      });
    }, 200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-90">
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-4 text-gray-600">Loading Kanji Study...</p>
    </div>
  );
};

// Create auth context
const AuthContext = createContext({});

// Enhanced AuthProvider with web and mobile support
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const isNative = Capacitor.isNativePlatform();

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (isNative) {
          // Mobile platform initialization
          const unsubscribe = FirebaseAuthentication.addListener(
            "authStateChange",
            (state) => {
              if (state.user) {
                setUser({
                  uid: state.user.uid,
                  email: state.user.email,
                  displayName: state.user.displayName,
                  photoURL: state.user.photoURL,
                });
              } else {
                setUser(null);
              }
              setLoading(false);
              setInitialized(true);
            }
          );

          // Get initial auth state
          const result = await FirebaseAuthentication.getCurrentUser();
          if (result.user) {
            setUser({
              uid: result.user.uid,
              email: result.user.email,
              displayName: result.user.displayName,
              photoURL: result.user.photoURL,
            });
          }

          return () => {
            if (unsubscribe) {
              FirebaseAuthentication.removeAllListeners();
            }
          };
        } else {
          // Web platform initialization
          await setPersistence(auth, browserLocalPersistence);
          const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
              setUser({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
              });
            } else {
              setUser(null);
            }
            setLoading(false);
            setInitialized(true);
          });

          return () => unsubscribe();
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setLoading(false);
        setInitialized(true);
      }
    };

    initAuth();
  }, [isNative]);

  const signup = async (email, password) => {
    setLoading(true);
    try {
      if (isNative) {
        const result =
          await FirebaseAuthentication.createUserWithEmailAndPassword({
            email,
            password,
          });
        return result;
      } else {
        const result = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        return result;
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      if (isNative) {
        const result = await FirebaseAuthentication.signInWithEmailAndPassword({
          email,
          password,
        });
        return result;
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return result;
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (isNative) {
        await FirebaseAuthentication.signOut();
      } else {
        await signOut(auth);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    if (isNative) {
      await FirebaseAuthentication.sendPasswordResetEmail({ email });
    } else {
      await sendPasswordResetEmail(auth, email);
    }
  };

  const googleLogin = async () => {
    setLoading(true);
    try {
      if (isNative) {
        // Clear any existing session first
        await FirebaseAuthentication.signOut();

        // Initialize with specific scopes if needed
        const result = await FirebaseAuthentication.signInWithGoogle({
          skipNativeAuth: false,
          scopes: ["profile", "email"],
        });

        // Log the result for debugging
        console.log("Native Google Sign-in Result:", result);

        return result;
      } else {
        const provider = new GoogleAuthProvider();
        provider.addScope("profile");
        provider.addScope("email");
        const result = await signInWithPopup(auth, provider);
        return result;
      }
    } catch (error) {
      console.error("Google Sign-in Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Only render children when Firebase Auth is initialized
  if (!initialized) {
    return <LoadingBar />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        login,
        logout,
        resetPassword,
        googleLogin,
      }}
    >
      {loading ? <LoadingBar /> : children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
