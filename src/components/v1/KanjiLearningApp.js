// src/components/KanjiLearningApp.js
"use client";

import React from "react";
import HomeSelector from "../HomeSelector";
import { kanjiData } from "@/data/kanjiData";
import { useSettings } from "@/context/SettingsContext";

const KanjiLearningApp = () => {
  const { setSelectedLevel, setSelectedChapter } = useSettings();

  const handleLevelSelect = (level) => {
    setSelectedLevel(level.id);
  };

  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter.chapter_number.toString());
  };

  return (
    <div>
      <HomeSelector
        kanjiData={kanjiData}
        onSelectLevel={handleLevelSelect}
        onSelectChapter={handleChapterSelect}
      />
      <div className="min-h-20"></div>
    </div>
  );
};

export default KanjiLearningApp;
