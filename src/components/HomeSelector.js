import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronDown, Shuffle } from "lucide-react";
import { StudyMode } from "./study/StudyMode";

const HomeSelector = ({ kanjiData, onSelectLevel, onSelectChapter }) => {
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    // Default to single level if only one exists
    if (kanjiData.levels.length === 1) {
      handleLevelChange(kanjiData.levels[0].id);
    }
  }, []);

  useEffect(() => {
    if (selectedLevel) {
      const level = kanjiData.levels.find((l) => l.id === selectedLevel);
      setChapters(level?.chapters || []);
      setSelectedChapter("");

      // Default to single chapter if only one exists
      if (level?.chapters.length === 1) {
        handleChapterChange(level.chapters[0].chapter_number.toString());
      }
    }
  }, [selectedLevel, kanjiData.levels]);

  const handleLevelChange = (levelId) => {
    setSelectedLevel(levelId);
    const level = kanjiData.levels.find((l) => l.id === levelId);
    onSelectLevel(level);
  };

  const handleChapterChange = (chapterNumber) => {
    const chapter = chapters.find(
      (c) => c.chapter_number.toString() === chapterNumber
    );
    setSelectedChapter(chapterNumber);
    if (chapter) {
      onSelectChapter(chapter);
    }
  };

  const handleRandomChapter = () => {
    // Get available levels
    const availableLevels = kanjiData.levels.filter(
      (level) => level.chapters.length > 0
    );
    if (availableLevels.length === 0) return;

    // Select random level
    const randomLevelIndex = Math.floor(Math.random() * availableLevels.length);
    const randomLevel = availableLevels[randomLevelIndex];

    // Select random chapter from chosen level
    const availableChapters = randomLevel.chapters;
    const randomChapterIndex = Math.floor(
      Math.random() * availableChapters.length
    );
    const randomChapter = availableChapters[randomChapterIndex];

    // Update states and notify parent
    setSelectedLevel(randomLevel.id);
    setSelectedChapter(randomChapter.chapter_number.toString());
    onSelectLevel(randomLevel);
    onSelectChapter(randomChapter);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Logo Container */}
      <div className="w-64 h-64 mx-auto mb-8 relative animate-fade-in">
        <Image
          src="/images/kanji-study-logo.png" // Make sure to add the image to public folder
          alt="Kanji Study Logo"
          width={256}
          height={256}
          className="object-contain"
          priority // Ensures the logo loads first
        />
      </div>
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center">
          Welcome to Kanji Study
        </h1>
        {/* <p className="text-gray-600 text-center">
          Get started by creating a deck or adding favorites to study.
          Meanwhile, you can practice with our default kanji set!
        </p> */}
        <p className="text-gray-600 text-center">
          Get started by selecting a Chapter to study.
        </p>
        {/* Level Selector */}
        <div className="relative">
          <select
            value={selectedLevel}
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
              value={selectedChapter}
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
        {/* Random Button */}
        <button
          onClick={handleRandomChapter}
          className="w-full p-4 bg-blue-500 text-white rounded-lg shadow flex items-center justify-center gap-2 hover:bg-blue-600"
        >
          <Shuffle size={20} />
          <span>Random Chapter</span>
        </button>{" "}
        <StudyMode />
      </div>
    </div>
  );
};

export default HomeSelector;
