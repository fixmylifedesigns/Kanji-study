"use client";

import { createContext, useContext, useReducer } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const KanjiContext = createContext({});

const initialState = {
  favorites: [],
  decks: [],
  studyProgress: {},
};

export function KanjiProvider({ children }) {
  const [favorites, setFavorites] = useLocalStorage("kanji_favorites", []);
  const [decks, setDecks] = useLocalStorage("kanji_decks", []);
  const [studyProgress, setStudyProgress] = useLocalStorage(
    "study_progress",
    {}
  );

  const addToFavorites = (kanji) => {
    setFavorites((prev) => [...prev, kanji]);
  };

  const removeFromFavorites = (kanji) => {
    setFavorites((prev) => prev.filter((k) => k.character !== kanji.character));
  };

  const createDeck = (name) => {
    setDecks((prev) => [
      ...prev,
      {
        id: Date.now(),
        name,
        created: new Date().toISOString(),
        lastStudied: null,
        kanjiList: [],
      },
    ]);
  };

  const addToDeck = (deckId, kanji) => {
    setDecks((prev) =>
      prev.map((deck) =>
        deck.id === deckId
          ? { ...deck, kanjiList: [...deck.kanjiList, kanji] }
          : deck
      )
    );
  };

  const updateStudyProgress = (kanjiId, correct) => {
    setStudyProgress((prev) => ({
      ...prev,
      [kanjiId]: {
        ...(prev[kanjiId] || {}),
        attempts: (prev[kanjiId]?.attempts || 0) + 1,
        correct: (prev[kanjiId]?.correct || 0) + (correct ? 1 : 0),
        lastStudied: new Date().toISOString(),
      },
    }));
  };

  const value = {
    favorites,
    decks,
    studyProgress,
    addToFavorites,
    removeFromFavorites,
    createDeck,
    addToDeck,
    updateStudyProgress,
  };

  return (
    <KanjiContext.Provider value={value}>{children}</KanjiContext.Provider>
  );
}

export const useKanji = () => {
  const context = useContext(KanjiContext);
  if (context === undefined) {
    throw new Error("useKanji must be used within a KanjiProvider");
  }
  return context;
};
