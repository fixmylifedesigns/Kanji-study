// src/app/flashcards/page.js
"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { kanjiData } from "@/data/kanjiData";
import { useSettings } from "@/context/SettingsContext";

export default function FlashcardsPage() {
  const router = useRouter();
  const { showRomaji, selectedLevel, selectedChapter } = useSettings();
  const [currentKanjiIndex, setCurrentKanjiIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedReading, setSelectedReading] = useState(0);

  // Get current chapter data from selected level and chapter
  const currentChapter = useMemo(() => {
    if (!selectedLevel || !selectedChapter) return null;
    const level = kanjiData.levels.find(l => l.id === selectedLevel);
    return level?.chapters.find(
      c => c.chapter_number === parseInt(selectedChapter)
    );
  }, [selectedLevel, selectedChapter]);

  // Get current kanji data
  const currentKanji = useMemo(() => {
    if (!currentChapter?.kanji_list) return null;
    return currentChapter.kanji_list[currentKanjiIndex];
  }, [currentChapter, currentKanjiIndex]);

  // Reset state when chapter changes
  React.useEffect(() => {
    setCurrentKanjiIndex(0);
    setIsFlipped(false);
    setSelectedReading(0);
  }, [currentChapter]);

  // Handle navigation functions
  const handleNext = () => {
    if (!currentChapter?.kanji_list) return;
    setCurrentKanjiIndex(prev => (prev + 1) % currentChapter.kanji_list.length);
    setIsFlipped(false);
    setSelectedReading(0);
  };

  const handlePrevious = () => {
    if (!currentChapter?.kanji_list) return;
    setCurrentKanjiIndex(prev => 
      prev === 0 ? currentChapter.kanji_list.length - 1 : prev - 1
    );
    setIsFlipped(false);
    setSelectedReading(0);
  };

  // Memoize the readings section
  const ReadingsSection = useMemo(() => {
    if (!currentKanji) return null;
    
    return (
      <div className="w-full space-y-4">
        {currentKanji.readings.map((reading, idx) => (
          <div
            key={reading.romaji}
            className={`p-3 rounded ${
              selectedReading === idx ? "bg-blue-50" : "hover:bg-gray-50"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedReading(idx);
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="text-lg font-bold">{reading.hiragana}</div>
              {reading.reading_type === "onyomi" && reading.katakana && (
                <div className="text-lg text-gray-600">({reading.katakana})</div>
              )}
              {showRomaji && (
                <div className="text-sm text-gray-600">
                  [{reading.romaji}] - {reading.reading_type}
                </div>
              )}
            </div>
            {reading.example && (
              <div className="mt-2 text-sm">
                <div>{reading.example.japanese}</div>
                <div className="text-gray-600 mt-1">{reading.example.hiragana}</div>
                <div className="text-gray-600 mt-1">{reading.example.english}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }, [currentKanji, selectedReading, showRomaji]);

  // If no chapter or kanji data, show selection prompt
  if (!currentChapter || !currentKanji) {
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
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-[600px] h-[80vh] mx-auto">
          <div className="text-center text-gray-600 mb-4">
            Card {currentKanjiIndex + 1} of {currentChapter.kanji_list.length}
          </div>

          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="h-[calc(100%-120px)] bg-white border-2 border-blue-200 rounded-xl mb-4 cursor-pointer overflow-auto"
          >
            <div className="p-6 flex flex-col items-center justify-center h-full">
              {!isFlipped ? (
                <>
                  <div className="text-8xl mb-4">
                    {currentKanji.kanji}
                  </div>
                  <div className="text-xl text-gray-600">
                    {currentKanji.meaning}
                  </div>
                </>
              ) : (
                ReadingsSection
              )}
            </div>
          </div>

          <div className="flex justify-between gap-4">
            <button
              onClick={handlePrevious}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
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