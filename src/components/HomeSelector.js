// src/components/HomeSelector.js
"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { ChevronDown, Shuffle } from "lucide-react";
import { StudyMode } from "./study/StudyMode";
import { useSettings } from "@/context/SettingsContext";

const HomeSelector = ({ kanjiData }) => {
  const { 
    selectedLevel, 
    setSelectedLevel, 
    selectedChapter, 
    setSelectedChapter 
  } = useSettings();

  // Get chapters based on selected level
  const chapters = React.useMemo(() => {
    if (!selectedLevel) return [];
    const level = kanjiData.levels.find(l => l.id === selectedLevel);
    return level?.chapters || [];
  }, [selectedLevel, kanjiData.levels]);

  // Default to single level if only one exists
  useEffect(() => {
    if (kanjiData.levels.length === 1 && !selectedLevel) {
      handleLevelChange(kanjiData.levels[0].id);
    }
  }, [kanjiData.levels]);

  // Default to single chapter if only one exists
  useEffect(() => {
    if (chapters.length === 1 && !selectedChapter) {
      handleChapterChange(chapters[0].chapter_number.toString());
    }
  }, [chapters]);

  const handleLevelChange = (levelId) => {
    setSelectedLevel(levelId);
    setSelectedChapter(null); // Reset chapter when level changes
  };

  const handleChapterChange = (chapterNumber) => {
    setSelectedChapter(chapterNumber);
  };

  const handleRandomChapter = () => {
    const availableLevels = kanjiData.levels.filter(
      level => level.chapters.length > 0
    );
    if (availableLevels.length === 0) return;

    const randomLevel = availableLevels[
      Math.floor(Math.random() * availableLevels.length)
    ];
    const randomChapter = randomLevel.chapters[
      Math.floor(Math.random() * randomLevel.chapters.length)
    ];

    setSelectedLevel(randomLevel.id);
    setSelectedChapter(randomChapter.chapter_number.toString());
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="w-64 h-64 mx-auto mb-8 relative animate-fade-in">
        <Image
          src="/images/kanji-study-logo.png"
          alt="Kanji Study Logo"
          width={256}
          height={256}
          className="object-contain"
          priority
        />
      </div>
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center">Welcome to Kanji Study</h1>
        <p className="text-gray-600 text-center">
          Get started by selecting a Chapter to study.
        </p>

        {/* Level Selector */}
        <div className="relative">
          <select
            value={selectedLevel || ""}
            onChange={(e) => handleLevelChange(e.target.value)}
            className="w-full p-4 bg-white rounded-lg shadow appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select JLPT Level</option>
            {kanjiData.levels.map((level) => (
              <option key={level.id} value={level.id}>
                {level.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>

        {/* Chapter Selector */}
        {selectedLevel && (
          <div className="relative">
            <select
              value={selectedChapter || ""}
              onChange={(e) => handleChapterChange(e.target.value)}
              className="w-full p-4 bg-white rounded-lg shadow appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Chapter</option>
              {chapters.map((chapter) => (
                <option
                  key={chapter.chapter_number}
                  value={chapter.chapter_number}
                >
                  Chapter {chapter.chapter_number}: {chapter.chapter_title}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        )}

        <button
          onClick={handleRandomChapter}
          className="w-full p-4 bg-blue-500 text-white rounded-lg shadow flex items-center justify-center gap-2 hover:bg-blue-600"
        >
          <Shuffle size={20} />
          <span>Random Chapter</span>
        </button>
        <StudyMode />
      </div>
    </div>
  );
};

export default HomeSelector;