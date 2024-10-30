// src/components/study/StudyDeckSelection.js
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useKanji } from "@/context/KanjiContext";
import { Card, CardContent } from "@/components/ui/card";
import { Book, Star, ArrowRight, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function StudyDeckSelection() {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const router = useRouter();

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
        {/* <div className="h-20 bg-gray-200 rounded-lg"></div> */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-10 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  const hasNoContent =
    (!decks || decks.length === 0) && (!favorites || favorites.length === 0);

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        {/* User's Decks */}
        <Card
          onClick={() => router.push("/decks")}
          className="cursor-pointer transform transition-all hover:scale-[1.02] hover:shadow-lg"
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Book className="w-5 h-5" />
                  Your Decks
                </h2>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        {/* Favorites Section */}{" "}
        <Card
          onClick={() => router.push("/favorites")}
          className="cursor-pointer transform transition-all hover:scale-[1.02] hover:shadow-lg"
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Your Favorites
                </h2>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
          </CardContent>
        </Card>
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
