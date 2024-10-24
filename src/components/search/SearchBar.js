// src/components/search/SearchBar.js
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { searchKanji } from "@/lib/api/jisho";
import { useKanji } from "@/context/KanjiContext";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToFavorites, favorites } = useKanji();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      const data = await searchKanji(query);

      if (data?.data) {
        const formattedResults = data.data.map((item) => ({
          slug: item.slug,
          kanji: item.japanese?.[0]?.word || item.japanese?.[0]?.reading,
          reading: item.japanese?.[0]?.reading,
          meanings: item.senses?.[0]?.english_definitions || [],
          jlpt: item.jlpt?.[0] || null,
          isFavorited: favorites?.some(
            (f) =>
              f.character ===
              (item.japanese?.[0]?.word || item.japanese?.[0]?.reading)
          ),
        }));
        setResults(formattedResults);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError(err.message || "Failed to search kanji. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToFavorites = (result) => {
    if (addToFavorites) {
      addToFavorites({
        character: result.kanji,
        reading: result.reading,
        meaning: result.meanings.join(", "),
      });

      setResults((prev) =>
        prev.map((r) =>
          r.kanji === result.kanji ? { ...r, isFavorited: true } : r
        )
      );
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for kanji or words..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg 
                   hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Searching...
            </span>
          ) : (
            "Search"
          )}
        </button>
      </form>

      {error && (
        <div className="p-4 text-red-700 bg-red-100 rounded-lg">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((result) => (
          <Card key={result.slug}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-3xl mb-2">{result.kanji}</div>
                  <div className="text-sm text-gray-600 mb-1">
                    {result.reading}
                  </div>
                  <div className="text-sm">
                    {result.meanings.slice(0, 2).join(", ")}
                  </div>
                  {result.jlpt && (
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        {result.jlpt}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleAddToFavorites(result)}
                  disabled={result.isFavorited}
                  className={`text-2xl ${
                    result.isFavorited
                      ? "text-yellow-500 cursor-not-allowed"
                      : "text-gray-400 hover:text-yellow-500"
                  }`}
                >
                  {result.isFavorited ? "★" : "☆"}
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {results.length === 0 && query && !isLoading && !error && (
        <div className="text-center text-gray-600 py-8">
          No results found. Try a different search term.
        </div>
      )}
    </div>
  );
}
