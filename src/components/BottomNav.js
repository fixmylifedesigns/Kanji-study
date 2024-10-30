// src/components/BottomNav.js

import React from "react";
import { Home, BookOpen, Gamepad2, Settings, Search } from "lucide-react";
import { useRouter } from "next/navigation";

const BottomNav = ({ currentPage }) => {
  const router = useRouter();
  const onNavigate = (page) => {
    setCurrentPage(page);
    if (page === "flashcards") {
      setMode("flashcards");
    } else if (page === "game") {
      setMode("game");
      if (selectedChapter) {
        startGame(selectedChapter.kanji_list);
      }
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 pb-6 pt-2">
      <div className="relative flex justify-between items-center max-w-lg mx-auto">
        <button
          onClick={() => router.push("/")}
          className={`flex flex-col items-center p-2 ${
            currentPage === "home" ? "text-blue-500" : "text-gray-500"
          }`}
        >
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </button>

        <button
          onClick={() => router.push("/flashcards")}
          className={`flex flex-col items-center p-2 ${
            currentPage === "flashcards" ? "text-blue-500" : "text-gray-500"
          }`}
        >
          <BookOpen size={24} />
          <span className="text-xs mt-1">Cards</span>
        </button>

        <div className="absolute left-1/2 -translate-x-1/2 -top-5">
          <button
            onClick={() => router.push("/search")}
            className="bg-blue-500 text-white p-4 rounded-full shadow-lg"
          >
            <Search size={24} />
          </button>
        </div>

        <button
          onClick={() => router.push("/game")}
          className={`flex flex-col items-center p-2 ${
            currentPage === "game" ? "text-blue-500" : "text-gray-500"
          }`}
        >
          <Gamepad2 size={24} />
          <span className="text-xs mt-1">Game</span>
        </button>

        <button
          onClick={() => router.push("/settings")}
          className={`flex flex-col items-center p-2 ${
            currentPage === "settings" ? "text-blue-500" : "text-gray-500"
          }`}
        >
          <Settings size={24} />
          <span className="text-xs mt-1">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
