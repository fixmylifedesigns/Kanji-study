// src/components/KanjiLearningApp.js
"use client";

import React from "react";
import HomeSelector from "../HomeSelector";
import { kanjiData } from "@/data/kanjiData";
import {StudyMode} from "../study/StudyMode";

const KanjiLearningApp = () => {
  const handleLevelSelect = (level) => {
    localStorage.setItem("selectedLevel", level.id);
  };

  const handleChapterSelect = (chapter, level) => {
    localStorage.setItem("selectedChapter", chapter.chapter_number.toString());
  };

  return (
    <div>
      <HomeSelector
        kanjiData={kanjiData}
        onSelectLevel={handleLevelSelect}
        onSelectChapter={(chapter) => handleChapterSelect(chapter)}
      />
      <></>
    </div>
  );
};

export default KanjiLearningApp;
