// src/app/search/page.js
"use client";
import { FavoritesList } from "@/components/favorites/FavoritesList";
import BottomNav from "@/components/BottomNav";

export default function Decks() {
  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <FavoritesList />
      </div>
      <BottomNav currentPage={"home"} />
    </main>
  );
}
