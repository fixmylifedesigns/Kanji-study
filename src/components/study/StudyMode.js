// src/components/study/StudyMode.js
"use client";

import { useState } from "react";
import { KanjiFlashcard } from "./KanjiFlashcard";
import { KanjiGame } from "./KanjiGame";
import { StudyDeckSelection } from "./StudyDeckSelection";
import { ArrowLeft } from "lucide-react";

export function StudyMode() {
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [mode, setMode] = useState("flashcards");
  const [showRomaji, setShowRomaji] = useState(true);

  const handleDeckSelect = (deck) => {
    // If it's favorites, transform the data structure
    if (deck.type === 'favorites') {
      setSelectedDeck({
        type: 'favorites',
        items: deck.items,
        name: 'Favorites'
      });
    }
    // If it's a custom deck
    else if (deck.id) {
      setSelectedDeck({
        type: 'custom',
        id: deck.id,
        name: deck.name
      });
    }
  };

  const handleDefaultDeckSelect = () => {
    setSelectedDeck({
      type: 'default',
      name: 'Basic Kanji Set'
    });
  };

  const handleBack = () => {
    setSelectedDeck(null);
  };

  if (!selectedDeck) {
    return (
      <StudyDeckSelection
        onDeckSelect={handleDeckSelect}
        onDefaultDeckSelect={handleDefaultDeckSelect}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button and Title */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 
                   transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Decks
        </button>
        <h2 className="text-lg font-semibold text-gray-900">
          Studying: {selectedDeck.name}
        </h2>
      </div>

      {/* Study Mode Selection */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setMode("flashcards")}
          className={`px-6 py-2 rounded-lg transition-colors ${
            mode === "flashcards"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Flashcards
        </button>
        <button
          onClick={() => setMode("game")}
          className={`px-6 py-2 rounded-lg transition-colors ${
            mode === "game"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Game
        </button>
      </div>

      {/* Romaji Toggle */}
      <div className="flex justify-center items-center">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showRomaji}
            onChange={(e) => setShowRomaji(e.target.checked)}
            className="hidden"
          />
          <div
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg
              ${showRomaji ? "text-blue-600" : "text-gray-600"}
            `}
          >
            <div
              className={`
                w-4 h-4 border rounded
                ${showRomaji ? "bg-blue-500 border-blue-500" : "border-gray-300"}
                flex items-center justify-center
              `}
            >
              {showRomaji && (
                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24">
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            Show Romaji
          </div>
        </label>
      </div>

      {/* Study Component */}
      <div>
        {mode === "flashcards" ? (
          <KanjiFlashcard
            key={`flashcard-${showRomaji}-${selectedDeck.type}-${selectedDeck.id || ''}`}
            showRomaji={showRomaji}
            deck={selectedDeck}
          />
        ) : (
          <KanjiGame 
            key={`game-${showRomaji}-${selectedDeck.type}-${selectedDeck.id || ''}`}
            showRomaji={showRomaji}
            deck={selectedDeck}
          />
        )}
      </div>
    </div>
  );
}