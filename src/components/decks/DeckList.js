// src/components/decks/DeckList.js
"use client";

import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { format } from "date-fns";

export function DeckList() {
  const [decks, setDecks] = useLocalStorage("kanji_decks", []);
  const [mounted, setMounted] = useState(false);

  // Only render after mount to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const createDeck = (name) => {
    const timestamp = Date.now();
    setDecks((prev) => [
      ...prev,
      {
        id: `deck-${timestamp}`,
        name,
        created: timestamp,
        lastStudied: null,
        kanjiList: [],
      },
    ]);
  };

  if (!mounted) {
    return (
      <div className="space-y-6 animate-pulse">
        <h2 className="text-2xl font-bold">Your Study Decks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Study Decks</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {decks && decks.map((deck) => (
          <div
            key={deck.id}
            className="p-4 bg-white rounded-lg shadow hover:shadow-md 
                     transition-shadow cursor-pointer"
          >
            <h3 className="font-bold">{deck.name}</h3>
            <p className="text-sm text-gray-600">
              {deck.kanjiList.length} cards
            </p>
            {deck.lastStudied && (
              <p className="text-sm text-gray-600">
                Last studied: {format(new Date(deck.lastStudied), "PP")}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
