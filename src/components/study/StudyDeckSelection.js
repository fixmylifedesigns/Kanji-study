// src/components/study/StudyDeckSelection.js
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useKanji } from "@/context/KanjiContext";
import { Card, CardContent } from "@/components/ui/card";
import { Book, Star, ArrowRight, Plus } from "lucide-react";
import { format } from "date-fns";

export function StudyDeckSelection({ onDeckSelect, onDefaultDeckSelect }) {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (user) {
      Promise.all([fetchDecks(), fetchFavorites()]).finally(() => {
        setLoading(false);
      });
    }
  }, [user]);

  const fetchDecks = async () => {
    try {
      const response = await fetch(`/api/decks?userId=${user.uid}`);
      const data = await response.json();
      if (response.ok) {
        setDecks(data.decks || []); // Add default empty array
      }
    } catch (error) {
      console.error("Error fetching decks:", error);
      setDecks([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await fetch(`/api/favorites?userId=${user.uid}`);
      const data = await response.json();
      if (response.ok) {
        setFavorites(data.favorites || []);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-20 bg-gray-200 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  const hasNoContent =
    (!decks || decks.length === 0) && (!favorites || favorites.length === 0);

  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome to Kanji Study
        </h1>
        {hasNoContent ? (
          <p className="text-gray-600">
            Get started by creating a deck or adding favorites to study.
            Meanwhile, you can practice with our default kanji set!
          </p>
        ) : (
          <p className="text-gray-600">
            Choose a deck or your favorites to start studying
          </p>
        )}
      </div>

      {/* Default Deck Card */}
      <Card
        onClick={onDefaultDeckSelect}
        className="cursor-pointer transform transition-all hover:scale-[1.02] hover:shadow-lg"
      >
        <CardContent className="p-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Book className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Basic Kanji Set</h3>
              <p className="text-gray-600 text-sm">
                Start with common kanji for beginners
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400" />
        </CardContent>
      </Card>

      <div className="space-y-6">
        {/* User's Decks */}
        {decks && decks.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Book className="w-5 h-5" />
              Your Decks
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {decks.map((deck) => (
                <Card
                  key={deck.id}
                  onClick={() => onDeckSelect(deck)}
                  className="cursor-pointer transform transition-all hover:scale-[1.02] hover:shadow-lg"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{deck.name}</h3>
                        <p className="text-sm text-gray-600">
                          {deck.kanjiCount || 0} cards
                        </p>
                        {deck.lastStudied && (
                          <p className="text-xs text-gray-500 mt-1">
                            Last studied:{" "}
                            {format(new Date(deck.lastStudied), "PP")}
                          </p>
                        )}
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Favorites Section */}
        {favorites && favorites.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Your Favorites
            </h2>
            <Card
              onClick={() =>
                onDeckSelect({
                  type: "favorites",
                  items: favorites,
                  name: "Favorites",
                })
              }
              className="cursor-pointer transform transition-all hover:scale-[1.02] hover:shadow-lg"
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">Study Favorites</h3>
                    <p className="text-sm text-gray-600">
                      {favorites.length} cards
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Create Deck Button */}
      {hasNoContent && (
        <div className="flex justify-center">
          <button
            onClick={() => (window.location.href = "#decks")}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white 
                     rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Create Your First Deck
          </button>
        </div>
      )}
    </div>
  );
}
