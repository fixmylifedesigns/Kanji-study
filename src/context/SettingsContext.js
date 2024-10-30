// src/context/SettingsContext.js
"use client";

import { createContext, useContext, useState, useEffect } from "react";

const SettingsContext = createContext({});

export function SettingsProvider({ children }) {
  const [showRomaji, setShowRomaji] = useState(true);
  const [language, setLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedRomaji = localStorage.getItem("show_romaji");
        const savedLanguage = localStorage.getItem("preferred_language");

        if (savedRomaji !== null) {
          setShowRomaji(savedRomaji === "true");
        }
        if (savedLanguage) {
          setLanguage(savedLanguage);
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateShowRomaji = (value) => {
    try {
      setShowRomaji(value);
      localStorage.setItem("show_romaji", String(value));
    } catch (error) {
      console.error("Error saving romaji setting:", error);
    }
  };

  const updateLanguage = (value) => {
    try {
      setLanguage(value);
      localStorage.setItem("preferred_language", value);
    } catch (error) {
      console.error("Error saving language setting:", error);
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        showRomaji,
        language,
        updateShowRomaji,
        updateLanguage,
        isLoading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
