// src/components/auth/ProtectedRoute.js
"use client";

import { useAuth } from "@/context/AuthContext";
import { AuthUI } from "./AuthUI";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!user) {
    return <AuthUI />;
  }

  return children;
}
