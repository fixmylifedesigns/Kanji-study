// src/app/search/page.js
"use client";
import { DeckList } from "@/components/decks/DeckList";
import BottomNav from "@/components/BottomNav";

export default function Favorites() {
  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <DeckList />
      </div>
      <BottomNav currentPage={"home"} />
    </main>
  );
}
