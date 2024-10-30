// src/components/common/ClientOnly.js
"use client";

import { useEffect, useState } from "react";

export function ClientOnly({ children, fallback = null }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return fallback;
  }

  return children;
}

// Usage example:
export function ClientOnlyWithFallback({ children }) {
  return (
    <ClientOnly
      fallback={
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-full"></div>
        </div>
      }
    >
      {children}
    </ClientOnly>
  );
}
