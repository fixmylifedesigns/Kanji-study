// src/components/study/StudySection.jsx
"use client";

import { useState } from "react";
import { StudyMode } from "./StudyMode";
import { SearchBar } from "../search/SearchBar";
import { DeckList } from "../decks/DeckList";

export function StudySection() {
  const [activeTab, setActiveTab] = useState("study");

  const buttonClass = (isActive) => `
    px-6 py-2 rounded-lg transition-colors
    ${
      isActive
        ? "bg-blue-500 text-white"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }
  `;

  return (
    <div className="max-w-2xl mx-auto px-4">
      {/* Main Navigation */}
      <nav className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveTab("study")}
          className={buttonClass(activeTab === "study")}
        >
          Study
        </button>
        <button
          onClick={() => setActiveTab("search")}
          className={buttonClass(activeTab === "search")}
        >
          Search
        </button>
        <button
          onClick={() => setActiveTab("decks")}
          className={buttonClass(activeTab === "decks")}
        >
          Decks
        </button>
      </nav>

      {/* Study Mode Selection */}
      {activeTab === "study" && <StudyMode />}
      {activeTab === "search" && <SearchBar />}
      {activeTab === "decks" && <DeckList />}
    </div>
  );
}
