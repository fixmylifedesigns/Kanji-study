// src/app/search/page.js
"use client";
import {SearchBar} from "@/components/search/SearchBar";
import BottomNav from "@/components/BottomNav";

export default function Search() {
  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto"><SearchBar /></div>
      <BottomNav currentPage={"search"} />
    </main>
  );
}
