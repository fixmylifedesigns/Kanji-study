"use client";

import { useState } from "react";
import { KanjiFlashcard } from "./KanjiFlashcard";
import { KanjiGame } from "./KanjiGame";

export function StudyMode() {
  const [mode, setMode] = useState("flashcards");
  const [showRomaji, setShowRomaji] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setMode("flashcards")}
          className={`px-6 py-2 rounded-lg ${
            mode === "flashcards"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Flashcards
        </button>
        <button
          onClick={() => setMode("game")}
          className={`px-6 py-2 rounded-lg ${
            mode === "game"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Game
        </button>
      </div>

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

      <div>
        {mode === "flashcards" ? (
          <KanjiFlashcard
            key={`flashcard-${showRomaji}`}
            showRomaji={showRomaji}
          />
        ) : (
          <KanjiGame key={`game-${showRomaji}`} showRomaji={showRomaji} />
        )}
      </div>
    </div>
  );
}
