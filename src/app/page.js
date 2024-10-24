// src/app/page.js
"use client";
import { useAuth } from "@/context/AuthContext";
import { Settings } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { StudySection } from "@/components/study/StudySection";

export default function Home() {
  const { user, googleLogin } = useAuth();

  if (user) {
    return (
      <main className="min-h-screen bg-gray-50 py-8 relative">
        <Link
          href="/settings"
          className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-900"
        >
          <Settings size={24} />
        </Link>
        <StudySection />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md w-full">
        {/* Logo Container */}
        <div className="w-64 h-64 mx-auto mb-8 relative animate-fade-in">
          <Image
            src="/kanji-study-logo.png" // Make sure to add the image to public folder
            alt="Kanji Study Logo"
            width={256}
            height={256}
            className="object-contain"
            priority // Ensures the logo loads first
          />
        </div>

        {/* Sign in button */}
        <button
          onClick={googleLogin}
          className="w-full bg-blue-500 text-white rounded-lg 
                   py-3 px-4 flex items-center justify-center gap-3 
                   hover:bg-blue-600 transition-colors shadow-md"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path
              d="M23.766 12.277c0-.81-.073-1.59-.21-2.34H12.24v4.43h6.48c-.28 1.51-1.13 2.79-2.41 3.65v3.03h3.91c2.28-2.1 3.59-5.19 3.59-8.77z"
              fill="#4285F4"
            />
            <path
              d="M12.24 24c3.24 0 5.95-1.08 7.93-2.91l-3.91-3.03c-1.08.72-2.46 1.15-4.02 1.15-3.1 0-5.73-2.09-6.67-4.91H1.52v3.13C3.48 21.33 7.57 24 12.24 24z"
              fill="#34A853"
            />
            <path
              d="M5.57 14.3c-.24-.71-.37-1.47-.37-2.25 0-.79.13-1.54.37-2.25V6.67H1.52A11.95 11.95 0 0 0 0 12.05c0 1.92.45 3.74 1.52 5.38l4.05-3.13z"
              fill="#FBBC05"
            />
            <path
              d="M12.24 4.89c1.74 0 3.31.6 4.55 1.77l3.47-3.47C18.18 1.22 15.47 0 12.24 0 7.57 0 3.48 2.67 1.52 6.57l4.05 3.13c.94-2.82 3.57-4.91 6.67-4.91z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Google
        </button>

        {/* Language selector with updated styling */}
        <div className="flex items-center justify-center text-gray-600 space-x-2">
          <span>My language:</span>
          <button
            className="inline-flex items-center px-3 py-1 bg-white 
                         rounded-full border border-gray-200 hover:border-gray-300 
                         transition-colors"
          >
            <span className="mr-2">🇬🇧</span>
            <span>English</span>
          </button>
        </div>

        {/* Terms text with updated styling */}
        <p className="text-sm text-gray-500">
          By signing in to the app, you agree to our{" "}
          <Link
            href="/terms"
            className="text-blue-500 hover:underline hover:text-blue-600 
                     transition-colors"
          >
            Terms & Conditions
          </Link>
        </p>
      </div>
    </main>
  );
}
