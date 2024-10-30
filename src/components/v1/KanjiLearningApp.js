// src/components/KanjiLearningApp.js
"use client";
import React, { useState, useEffect } from "react";
import HomeSelector from '../HomeSelector'
// Preferences mock
const Preferences = {
  get: async ({ key }) => ({ value: localStorage.getItem(key) }),
  set: async ({ key, value }) => localStorage.setItem(key, value),
};

const STORAGE_KEYS = {
  LEVEL: "selectedLevel",
  CHAPTER: "selectedChapter",
};

// Sample data structure
const japaneseData = {
  levels: [
    {
      id: "n5",
      name: "JLPT N5",
      chapters: [
        {
          chapter_number: 10,
          chapter_title: "Food and Drink (たべもの)",
          kanji_list: [
            {
              kanji: "魚",
              meaning: "Fish",
              readings: [
                {
                  hiragana: "うお",
                  romaji: "uo",
                  reading_type: "kunyomi",
                  example: {
                    japanese: "魚いちばは あさはやく はじまります。",
                    hiragana: "さかないちばは あさはやく はじまります。",
                    english: "The fish market starts early in the morning.",
                    usage_highlight: "うお",
                  },
                },
                {
                  hiragana: "ぎょ",
                  katakana: "ギョ",
                  romaji: "gyo",
                  reading_type: "onyomi",
                  example: {
                    japanese: "魚類が好きです。",
                    hiragana: "ぎょるいが すきです。",
                    english: "I like fish.",
                    usage_highlight: "ぎょ",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "n4",
      name: "JLPT N4",
      chapters: [
        {
          chapter_number: 1,
          chapter_title: "Weather (てんき)",
          kanji_list: [
            {
              kanji: "雨",
              meaning: "Rain",
              readings: [
                {
                  hiragana: "あめ",
                  romaji: "ame",
                  reading_type: "kunyomi",
                  example: {
                    japanese: "雨が降っています。",
                    hiragana: "あめがふっています。",
                    english: "It is raining.",
                    usage_highlight: "あめ",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const KanjiLearningApp = () => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [mode, setMode] = useState("flashcards");
  const [showRomaji, setShowRomaji] = useState(true);
  const [currentKanjiIndex, setCurrentKanjiIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedReading, setSelectedReading] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [wrongAnswer, setWrongAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [currentPage, setCurrentPage] = useState("home");

  useEffect(() => {
    const loadPreferences = async () => {
      const savedLevel = await Preferences.get({ key: STORAGE_KEYS.LEVEL });
      const savedChapter = await Preferences.get({ key: STORAGE_KEYS.CHAPTER });

      if (savedLevel.value) {
        const level = japaneseData.levels.find(
          (l) => l.id === savedLevel.value
        );
        setSelectedLevel(level);
      } else if (japaneseData.levels.length === 1) {
        setSelectedLevel(japaneseData.levels[0]);
      }

      if (savedChapter.value && savedLevel.value) {
        const level = japaneseData.levels.find(
          (l) => l.id === savedLevel.value
        );
        const chapter = level?.chapters.find(
          (c) => c.chapter_number === parseInt(savedChapter.value)
        );
        setSelectedChapter(chapter);
      }
    };
    loadPreferences();
  }, []);

  const savePreferences = async (levelId, chapterNumber) => {
    await Preferences.set({ key: STORAGE_KEYS.LEVEL, value: levelId });
    await Preferences.set({
      key: STORAGE_KEYS.CHAPTER,
      value: chapterNumber.toString(),
    });
  };

  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
    setSelectedChapter(null);
    if (level.chapters.length === 1) {
      handleChapterSelect(level.chapters[0], level);
    }
  };

  const handleChapterSelect = (chapter, level) => {
    setSelectedChapter(chapter);
    savePreferences(level.id, chapter.chapter_number);
    setCurrentKanjiIndex(0);
    setIsFlipped(false);
    setSelectedReading(0);
    if (mode === "game") {
      startGame(chapter.kanji_list);
    }
  };

  const startGame = (kanjiList) => {
    const newQuestion = getRandomQuestion(kanjiList);
    setCurrentQuestion(newQuestion);
    setScore(0);
    setTotalAttempts(0);
    setWrongAnswer(null);
    setCorrectAnswer(null);
  };

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

  const handleNext = () => {
    setCurrentKanjiIndex(
      (prev) => (prev + 1) % selectedChapter.kanji_list.length
    );
    setIsFlipped(false);
    setSelectedReading(0);
  };

  const handlePrevious = () => {
    setCurrentKanjiIndex((prev) =>
      prev === 0 ? selectedChapter.kanji_list.length - 1 : prev - 1
    );
    setIsFlipped(false);
    setSelectedReading(0);
  };


  const shakeAnimation = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-5px); }
      40%, 80% { transform: translateX(5px); }
    }
  `;

  const renderMainContent = () => {
    if (!selectedLevel && currentPage === "home") {
      return (
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4 text-center">
            Select JLPT Level
          </h2>
          <div className="grid gap-4">
            {japaneseData.levels.map((level) => (
              <button
                key={level.id}
                onClick={() => handleLevelSelect(level)}
                className="p-4 bg-white rounded-lg shadow hover:bg-blue-50 text-left"
              >
                <h3 className="font-bold">{level.name}</h3>
                <p className="text-sm text-gray-600">
                  {level.chapters.length} chapters
                </p>
              </button>
            ))}
          </div>
        </div>
      );
    }
    if (currentPage === "home") {
      return (
        <HomeSelector
          japaneseData={japaneseData}
          onSelectLevel={handleLevelSelect}
          onSelectChapter={(chapter) =>
            handleChapterSelect(chapter, selectedLevel)
          }
        />
      );
    }

    if (
      selectedChapter &&
      (currentPage === "flashcards" || currentPage === "game")
    ) {
      return (
        <>
          <div className="mb-4 flex justify-between items-center">
            <button
              onClick={() => setSelectedChapter(null)}
              className="text-blue-500 hover:underline"
            >
              ← Back to Chapters
            </button>
            <h2 className="text-lg font-bold">
              Chapter {selectedChapter.chapter_number}:{" "}
              {selectedChapter.chapter_title}
            </h2>
          </div>

          <div className="mb-6 space-y-4">
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setMode("flashcards")}
                className={`px-4 py-2 rounded-lg ${
                  mode === "flashcards"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Flashcards
              </button>
              <button
                onClick={() => {
                  setMode("game");
                  startGame(selectedChapter.kanji_list);
                }}
                className={`px-4 py-2 rounded-lg ${
                  mode === "game"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Game
              </button>
            </div>

            <div className="flex justify-center items-center gap-2">
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
          </div>

          {mode === "flashcards" ? (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center text-gray-600 mb-4">
                Card {currentKanjiIndex + 1} of{" "}
                {selectedChapter.kanji_list.length}
              </div>

              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="aspect-w-3 aspect-h-4 bg-white border-2 border-blue-200 rounded-xl mb-4 cursor-pointer"
              >
                <div className="p-6 flex flex-col items-center justify-center">
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
                      {selectedChapter.kanji_list[
                        currentKanjiIndex
                      ].readings.map((reading, idx) => (
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
                      ))}
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
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-6">
              {currentQuestion && (
                <>
                  <div className="text-center mb-6">
                    <div className="text-xl font-bold mb-2">
                      Score: {score} / {totalAttempts}
                    </div>
                    <div className="text-sm text-gray-600">
                      {((score / (totalAttempts || 1)) * 100).toFixed(1)}%
                      Correct
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

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                </>
              )}
            </div>
          )}
        </>
      );
    }
  };

  return (
    <div>
      <style>{shakeAnimation}</style>
      <div className="max-w-lg mx-auto">{renderMainContent()}</div>
    </div>
  );
};

export default KanjiLearningApp;
