// src/app/game/page.js
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { kanjiData } from "@/data/kanjiData";
const STORAGE_KEYS = {
  LEVEL: "selectedLevel",
  CHAPTER: "selectedChapter",
};

const Preferences = {
  get: async ({ key }) => ({ value: localStorage.getItem(key) }),
  set: async ({ key, value }) => localStorage.setItem(key, value),
};

export default function GamePage() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [wrongAnswer, setWrongAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);

  const shakeAnimation = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-5px); }
      40%, 80% { transform: translateX(5px); }
    }
  `;

  useEffect(() => {
    const loadPreferences = async () => {
      const savedLevel = await Preferences.get({ key: STORAGE_KEYS.LEVEL });
      const savedChapter = await Preferences.get({ key: STORAGE_KEYS.CHAPTER });

      if (savedLevel.value && savedChapter.value) {
        const level = kanjiData.levels.find(
          (l) => l.id === savedLevel.value
        );
        const chapter = level?.chapters.find(
          (c) => c.chapter_number === parseInt(savedChapter.value)
        );
        setSelectedLevel(level);
        setSelectedChapter(chapter);
        if (chapter) {
          startGame(chapter.kanji_list);
        }
      }
    };

    loadPreferences();
  }, []);

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
    setCurrentQuestion(newQuestion);
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
      setTimeout(() => {
        setCorrectAnswer(null);
        setCurrentQuestion(getRandomQuestion(selectedChapter.kanji_list));
      }, 500);
    } else {
      setWrongAnswer(selectedKanji);
      setTimeout(() => {
        setWrongAnswer(null);
      }, 820);
    }
  };

  if (!selectedChapter || !currentQuestion) {
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
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-[600px] h-[80vh] mx-auto">
          <div className="text-center mb-6">
            <div className="text-xl font-bold mb-2">
              Score: {score} / {totalAttempts}
            </div>
            <div className="text-sm text-gray-600">
              {((score / (totalAttempts || 1)) * 100).toFixed(1)}% Correct
            </div>
          </div>

          <div className="mb-6">
            <div className="text-center">
              <div className="text-2xl mb-2">Match this reading:</div>
              <div className="text-4xl font-bold mb-4">
                {currentQuestion.hiragana}
              </div>
              <div className="text-lg text-gray-600 mb-4">
                ({currentQuestion.meaning})
              </div>
              <div className="text-sm mb-2">
                {currentQuestion.example?.japanese}
              </div>
              <div className="text-sm text-gray-600">
                {currentQuestion.example?.english}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {selectedChapter.kanji_list.map((item) => (
              <button
                key={item.kanji}
                onClick={() => handleAnswer(item.kanji)}
                className={`
                  p-4 text-3xl border-2 rounded-lg transition-colors relative
                  ${
                    wrongAnswer === item.kanji
                      ? "animate-[shake_0.8s_ease-in-out] bg-red-50 border-red-300"
                      : correctAnswer === item.kanji
                      ? "bg-green-50 border-green-300"
                      : "bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300"
                  }
                `}
                style={{
                  animation:
                    wrongAnswer === item.kanji
                      ? "shake 0.8s ease-in-out"
                      : "none",
                }}
              >
                {item.kanji}
                {wrongAnswer === item.kanji && (
                  <div className="absolute inset-0 bg-red-500 opacity-20 rounded-lg" />
                )}
                {correctAnswer === item.kanji && (
                  <div className="absolute inset-0 bg-green-500 opacity-20 rounded-lg" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      <BottomNav currentPage="game" />
    </main>
  );
}
