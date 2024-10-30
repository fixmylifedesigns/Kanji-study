// src/app/flashcards/page.js
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { kanjiData } from "@/data/kanjiData";

const STORAGE_KEYS = {
  LEVEL: "selectedLevel",
  CHAPTER: "selectedChapter",
};

// Mock Preferences API for local storage
const Preferences = {
  get: async ({ key }) => ({ value: localStorage.getItem(key) }),
  set: async ({ key, value }) => localStorage.setItem(key, value),
};

export default function FlashcardsPage() {
  const router = useRouter();
  const [showRomaji, setShowRomaji] = useState(true);
  const [currentKanjiIndex, setCurrentKanjiIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedReading, setSelectedReading] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

  useEffect(() => {
    const loadPreferences = async () => {
      const savedLevel = await Preferences.get({ key: STORAGE_KEYS.LEVEL });
      const savedChapter = await Preferences.get({ key: STORAGE_KEYS.CHAPTER });

      if (savedLevel.value) {
        const level = kanjiData.levels.find((l) => l.id === savedLevel.value);
        setSelectedLevel(level);
      }

      if (savedChapter.value && savedLevel.value) {
        const level = kanjiData.levels.find((l) => l.id === savedLevel.value);
        const chapter = level?.chapters.find(
          (c) => c.chapter_number === parseInt(savedChapter.value)
        );
        setSelectedChapter(chapter);
      }
    };

    loadPreferences();
  }, []);

  const handleNext = () => {
    if (!selectedChapter) return;
    setCurrentKanjiIndex(
      (prev) => (prev + 1) % selectedChapter.kanji_list.length
    );
    setIsFlipped(false);
    setSelectedReading(0);
  };

  const handlePrevious = () => {
    if (!selectedChapter) return;
    setCurrentKanjiIndex((prev) =>
      prev === 0 ? selectedChapter.kanji_list.length - 1 : prev - 1
    );
    setIsFlipped(false);
    setSelectedReading(0);
  };

  if (!selectedChapter) {
    return (
      <main className="min-h-screen bg-gray-100">
        <div className="p-4">
          <div className="text-center">
            <p className="text-lg text-gray-600">
              Please select a chapter from the home page first.
            </p>
            <button
              onClick={() => router.push("/")}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Go to Home
            </button>
          </div>
        </div>
        <BottomNav currentPage="flashcards" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="p-4">
        <div className="mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showRomaji}
              onChange={() => setShowRomaji(!showRomaji)}
              className="w-4 h-4"
            />
            <span>Show Romaji</span>
          </label>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 max-w-[600px] h-[80vh] mx-auto">
          <div className="text-center text-gray-600 mb-4">
            Card {currentKanjiIndex + 1} of {selectedChapter.kanji_list.length}
          </div>

          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="h-[calc(100%-120px)] bg-white border-2 border-blue-200 rounded-xl mb-4 cursor-pointer overflow-auto"
          >
            <div className="p-6 flex flex-col items-center justify-center h-full">
              {!isFlipped ? (
                <>
                  <div className="text-8xl mb-4">
                    {selectedChapter.kanji_list[currentKanjiIndex].kanji}
                  </div>
                  <div className="text-xl text-gray-600">
                    {selectedChapter.kanji_list[currentKanjiIndex].meaning}
                  </div>
                </>
              ) : (
                <div className="w-full space-y-4">
                  {selectedChapter.kanji_list[currentKanjiIndex].readings.map(
                    (reading, idx) => (
                      <div
                        key={reading.romaji}
                        className={`p-3 rounded ${
                          selectedReading === idx
                            ? "bg-blue-50"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedReading(idx);
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="text-lg font-bold">
                            {reading.hiragana}
                          </div>
                          {reading.reading_type === "onyomi" && (
                            <div className="text-lg text-gray-600">
                              ({reading.katakana})
                            </div>
                          )}
                          {showRomaji && (
                            <div className="text-sm text-gray-600">
                              [{reading.romaji}] - {reading.reading_type}
                            </div>
                          )}
                        </div>
                        <div className="mt-2 text-sm">
                          <div>{reading.example.japanese}</div>
                          <div className="text-gray-600 mt-1">
                            {reading.example.hiragana}
                          </div>
                          <div className="text-gray-600 mt-1">
                            {reading.example.english}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between gap-4">
            <button
              onClick={handlePrevious}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <BottomNav currentPage="flashcards" />
    </main>
  );
}
