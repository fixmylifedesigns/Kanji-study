// src/components/favorites/FavoritesList.js
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Trash2 } from "lucide-react";

export function FavoritesList() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const response = await fetch(`/api/favorites?userId=${user.uid}`);
      const data = await response.json();
      if (response.ok) {
        // Use the data as-is without sorting
        setFavorites(data.favorites || []);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setError("Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (kanji) => {
    try {
      if (
        !confirm("Are you sure you want to remove this kanji from favorites?")
      ) {
        return;
      }

      const response = await fetch(
        `/api/favorites?userId=${user.uid}&kanji=${encodeURIComponent(
          kanji.character
        )}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove favorite");
      }

      // Remove from local state
      setFavorites((prev) =>
        prev.filter((f) => f.character !== kanji.character)
      );
    } catch (error) {
      setError("Failed to remove favorite");
      setTimeout(() => setError(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <h2 className="text-2xl font-bold">Your Favorites</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Star className="text-yellow-500" size={24} />
        <h2 className="text-2xl font-bold">Your Favorites</h2>
      </div>

      {error && (
        <div className="p-4 text-red-700 bg-red-100 rounded-lg">{error}</div>
      )}

      {favorites.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No favorites yet. Start adding some kanji to your favorites!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((kanji) => (
            <Card key={kanji.character} className="relative group">
              <CardContent className="p-4">
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleRemoveFavorite(kanji)}
                    className="p-1 text-red-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Remove from favorites"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="text-3xl mb-2">{kanji.character}</div>
                <div className="text-sm text-gray-600 mb-1">
                  {kanji.reading}
                </div>
                <div className="text-sm">
                  {Array.isArray(kanji.meanings)
                    ? kanji.meanings.join(", ")
                    : kanji.meanings}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
