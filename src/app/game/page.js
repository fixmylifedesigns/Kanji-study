// src/app/game/page.js
"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { kanjiData } from "@/data/kanjiData";
import { useSettings } from "@/context/SettingsContext";

/**
 * Generates 4 unique kanji choices, including the correct answer
 * @param {Array} kanjiList - Full list of available kanji
 * @param {string} correctKanji - The correct kanji that must be included
 * @returns {Array} Array of exactly 4 unique kanji characters
 */
function generateChoices(kanjiList, correctKanji) {
  // Create a set with the correct answer
  const choices = new Set([correctKanji]);

  // Keep adding random kanji until we have exactly 4 choices
  while (choices.size < 4) {
    const randomKanji =
      kanjiList[Math.floor(Math.random() * kanjiList.length)].kanji;
    choices.add(randomKanji);
  }

  // Convert to array and shuffle
  return shuffleArray([...choices]);
}

/**
 * Fisher-Yates shuffle algorithm for randomizing array elements
 * @param {Array} array - Array to be shuffled
 * @returns {Array} New shuffled array
 */
function shuffleArray(array) {
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

  // Get current chapter data from selected level and chapter
  const currentChapter = useMemo(() => {
    if (!selectedLevel || !selectedChapter) return null;
    const level = kanjiData.levels.find((l) => l.id === selectedLevel);
    return level?.chapters.find(
      (c) => c.chapter_number === parseInt(selectedChapter)
    );
  }, [selectedLevel, selectedChapter]);

  // Initialize game when chapter is loaded
  React.useEffect(() => {
    if (currentChapter) {
      startGame(currentChapter.kanji_list);
    }
  }, [currentChapter]);

  const shakeAnimation = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-5px); }
      40%, 80% { transform: translateX(5px); }
    }
  `;

  const getRandomQuestion = (kanjiList) => {
    const randomKanji = kanjiList[Math.floor(Math.random() * kanjiList.length)];
    const randomReading =
      randomKanji.readings[
        Math.floor(Math.random() * randomKanji.readings.length)
      ];

    return {
      kanji: randomKanji.kanji,
      hiragana: randomReading.hiragana,
      example: randomReading.example,
      meaning: randomKanji.meaning,
    };
  };

  const startGame = (kanjiList) => {
    const newQuestion = getRandomQuestion(kanjiList);
    const newChoices = generateChoices(kanjiList, newQuestion.kanji);

    setCurrentQuestion(newQuestion);
    setChoices(newChoices);
    setScore(0);
    setTotalAttempts(0);
    setWrongAnswer(null);
    setCorrectAnswer(null);
  };

  const handleAnswer = (selectedKanji) => {
    setTotalAttempts((prev) => prev + 1);

    if (selectedKanji === currentQuestion.kanji) {
      setScore((prev) => prev + 1);
      setCorrectAnswer(selectedKanji);

      // Set up next question after delay
      setTimeout(() => {
        if (currentChapter?.kanji_list) {
          const newQuestion = getRandomQuestion(currentChapter.kanji_list);
          const newChoices = generateChoices(
            currentChapter.kanji_list,
            newQuestion.kanji
          );

          setCurrentQuestion(newQuestion);
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
  };

  // Return for no chapter selected remains the same...
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
      <style>{shakeAnimation}</style>
      <div className="flex flex-col h-screen">
        {/* Score Section - Top */}
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

        {/* Question Section - Middle */}
        <div className="flex-grow p-4 flex flex-col justify-center">
          <div className="text-center space-y-6">
            <div className="text-3xl">Match this reading:</div>
            <div className="text-6xl font-bold mb-4">
              {currentQuestion.hiragana}
            </div>
            <div className="text-2xl text-gray-600 mb-4">
              ({currentQuestion.meaning})
            </div>
            <div className="text-lg">{currentQuestion.example?.hiragana}</div>
            <div className="text-lg text-gray-600">
              {currentQuestion.example?.english}
            </div>
          </div>
        </div>

        {/* Choices Section - Bottom */}
        <div className="p-4 pb-28 bg-white shadow-lg">
          <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
            {choices.map((kanji) => (
              <button
                key={kanji}
                onClick={() => handleAnswer(kanji)}
                className={`
                  py-8 text-5xl border-2 rounded-xl transition-colors relative
                  active:scale-95 transform
                  ${
                    wrongAnswer === kanji
                      ? "animate-[shake_0.8s_ease-in-out] bg-red-50 border-red-300"
                      : correctAnswer === kanji
                      ? "bg-green-50 border-green-300"
                      : "bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300"
                  }
                `}
                style={{
                  animation:
                    wrongAnswer === kanji ? "shake 0.8s ease-in-out" : "none",
                }}
              >
                {kanji}
                {wrongAnswer === kanji && (
                  <div className="absolute inset-0 bg-red-500 opacity-20 rounded-xl" />
                )}
                {correctAnswer === kanji && (
                  <div className="absolute inset-0 bg-green-500 opacity-20 rounded-xl" />
                )}
              </button>
            ))}
          </div>
        </div>

        <BottomNav currentPage="game" />
      </div>
    </main>
  );
}
