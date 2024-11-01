// src/hooks/useLocalStorage.js
"use client";

import { useState, useCallback } from "react";

export function useLocalStorage(key, initialValue) {
  // Initialize state with a function to avoid unnecessary localStorage access
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (!item || item === "undefined") {
        return initialValue;
      }
      return JSON.parse(item);
    } catch {
      return initialValue;
    }
  });

  // Memoize the setValue function to avoid recreating it on every render
  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        if (typeof window !== "undefined") {
          if (valueToStore === undefined) {
            window.localStorage.removeItem(key);
          } else {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
          }
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}
