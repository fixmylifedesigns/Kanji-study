// src/app/game/page.js
"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { kanjiData } from "@/data/kanjiData";
import { useSettings } from "@/context/SettingsContext";

function shuffleArray(array) {
  // Create a copy to avoid mutating the original array
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function GamePage() {
  const router = useRouter();
  const { selectedLevel, selectedChapter } = useSettings();

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [choices, setChoices] = useState([]);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [wrongAnswer, setWrongAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);

  // Get current chapter data using memo
  const currentChapter = useMemo(() => {
    if (!selectedLevel || !selectedChapter) return null;
    const level = kanjiData.levels.find((l) => l.id === selectedLevel);
    return level?.chapters.find(
      (c) => c.chapter_number === parseInt(selectedChapter)
    );
  }, [selectedLevel, selectedChapter]);

  // Initialize game on chapter change
  React.useEffect(() => {
    if (currentChapter?.kanji_list?.length) {
      const initialKanji = currentChapter.kanji_list[0];
      const initialChoices = generateChoices(currentChapter.kanji_list, initialKanji.kanji);
      setCurrentQuestion({
        kanji: initialKanji.kanji,
        hiragana: initialKanji.readings[0].hiragana,
        meaning: initialKanji.meaning,
      });
      setChoices(initialChoices);
    }
  }, [currentChapter]);

  const generateChoices = useCallback((kanjiList, correctKanji) => {
    const choices = new Set([correctKanji]);
    const availableKanji = kanjiList.map(k => k.kanji).filter(k => k !== correctKanji);
    
    while (choices.size < 4 && availableKanji.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableKanji.length);
      choices.add(availableKanji[randomIndex]);
      availableKanji.splice(randomIndex, 1);
    }

    return shuffleArray([...choices]);
  }, []);

  const handleAnswer = useCallback((selectedKanji) => {
    setTotalAttempts((prev) => prev + 1);

    if (selectedKanji === currentQuestion?.kanji) {
      setScore((prev) => prev + 1);
      setCorrectAnswer(selectedKanji);

      // Set up next question after delay
      setTimeout(() => {
        if (currentChapter?.kanji_list) {
          const nextKanjiIndex = Math.floor(Math.random() * currentChapter.kanji_list.length);
          const nextKanji = currentChapter.kanji_list[nextKanjiIndex];
          const newChoices = generateChoices(currentChapter.kanji_list, nextKanji.kanji);
          
          setCurrentQuestion({
            kanji: nextKanji.kanji,
            hiragana: nextKanji.readings[0].hiragana,
            meaning: nextKanji.meaning,
          });
          setChoices(newChoices);
          setCorrectAnswer(null);
        }
      }, 500);
    } else {
      setWrongAnswer(selectedKanji);
      setTimeout(() => {
        setWrongAnswer(null);
      }, 820);
    }
  }, [currentQuestion, currentChapter, generateChoices]);

  // Show message if no chapter selected
  if (!currentChapter || !currentQuestion) {
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
        <BottomNav currentPage="game" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="flex flex-col h-screen">
        {/* Score Section */}
        <div className="p-4 bg-white shadow-sm">
          <div className="text-center">
            <div className="text-2xl font-bold">
              Score: {score} / {totalAttempts}
            </div>
            <div className="text-base text-gray-600">
              {((score / (totalAttempts || 1)) * 100).toFixed(1)}% Correct
            </div>
          </div>
        </div>

        {/* Question Section */}
        <div className="flex-grow p-4 flex flex-col justify-center">
          <div className="text-center space-y-6">
            <div className="text-3xl">Match this reading:</div>
            <div className="text-6xl font-bold mb-4">
              {currentQuestion.hiragana}
            </div>
            <div className="text-2xl text-gray-600 mb-4">
              ({currentQuestion.meaning})
            </div>
          </div>
        </div>

        {/* Choices Section */}
        <div className="p-4 pb-28 bg-white shadow-lg">
          <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
            {choices.map((kanji) => (
              <button
                key={kanji}
                onClick={() => handleAnswer(kanji)}
                className={`
                  py-8 text-5xl border-2 rounded-xl transition-colors relative
                  ${wrongAnswer === kanji 
                    ? "bg-red-50 border-red-300" 
                    : correctAnswer === kanji
                    ? "bg-green-50 border-green-300"
                    : "bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300"
                  }
                `}
              >
                {kanji}
              </button>
            ))}
          </div>
        </div>

        <BottomNav currentPage="game" />
      </div>
    </main>
  );
}