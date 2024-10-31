// src/context/SettingsContext.js
"use client";

import { createContext, useContext } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export const STORAGE_KEYS = {
  LANGUAGE: "preferred_language",
  SHOW_ROMAJI: "show_romaji",
  LEVEL: "selectedLevel",
  CHAPTER: "selectedChapter",
};

export const LANGUAGES = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
];

const SettingsContext = createContext({});

export function SettingsProvider({ children }) {
  const [showRomaji, setShowRomaji] = useLocalStorage(
    STORAGE_KEYS.SHOW_ROMAJI,
    true
  );
  const [language, setLanguage] = useLocalStorage(STORAGE_KEYS.LANGUAGE, "en");
  const [selectedLevel, setSelectedLevel] = useLocalStorage(
    STORAGE_KEYS.LEVEL,
    null
  );
  const [selectedChapter, setSelectedChapter] = useLocalStorage(
    STORAGE_KEYS.CHAPTER,
    null
  );

  const value = {
    showRomaji,
    setShowRomaji,
    language,
    setLanguage,
    selectedLevel,
    setSelectedLevel,
    selectedChapter,
    setSelectedChapter,
  };

  return (
    <SettingsContext.Provider value={value}>
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
