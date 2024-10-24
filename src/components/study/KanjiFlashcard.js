// src/components/study/KanjiFlashcard.js
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useKanji } from "@/context/KanjiContext";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import kanjiData from "@/data/kanjiData.json"; // For default deck

export function KanjiFlashcard({ showRomaji = true, deck }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedReading, setSelectedReading] = useState(0);
  const [kanjiList, setKanjiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { favorites, addToFavorites, removeFromFavorites } = useKanji() || {};
  const { user } = useAuth();

  useEffect(() => {
    fetchDeckContent();
  }, [deck]);

  const fetchDeckContent = async () => {
    setLoading(true);
    try {
      let kanjiArray = [];

      if (deck.type === "default") {
        // Use the default kanji data
        kanjiArray = kanjiData.chapters.flatMap(
          (chapter) => chapter.kanji_list
        );
      } else if (deck.type === "favorites") {
        // Use the passed favorites
        kanjiArray = deck.items.map((fav) => ({
          kanji: fav.character,
          reading: fav.reading,
          meanings: Array.isArray(fav.meanings) ? fav.meanings : [fav.meanings],
          readings: [
            {
              hiragana: fav.reading,
              romaji: fav.reading, // You might want to add proper romaji conversion
            },
          ],
        }));
      } else {
        // Fetch deck's kanji from API
        const response = await fetch(
          `/api/decks/${deck.id}/kanji?userId=${user.uid}`
        );
        const data = await response.json();
        if (response.ok) {
          kanjiArray = data.kanji.map((k) => ({
            kanji: k.character,
            reading: k.reading,
            meanings: Array.isArray(k.meanings) ? k.meanings : [k.meanings],
            readings: [
              {
                hiragana: k.reading,
                romaji: k.reading, // You might want to add proper romaji conversion
              },
            ],
          }));
        }
      }

      setKanjiList(kanjiArray);
      setCurrentIndex(0); // Reset to first kanji
    } catch (error) {
      console.error("Error fetching deck content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    setSelectedReading(0);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % kanjiList.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setSelectedReading(0);
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + kanjiList.length) % kanjiList.length
    );
  };

  if (loading) {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardContent className="p-6 text-center text-gray-600">
          Loading flashcards...
        </CardContent>
      </Card>
    );
  }

  if (kanjiList.length === 0) {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardContent className="p-6 text-center text-gray-600">
          No kanji available in this{" "}
          {deck.type === "favorites" ? "favorites" : "deck"}.
        </CardContent>
      </Card>
    );
  }

  const currentKanji = kanjiList[currentIndex];
  const isFavorited = favorites?.some(
    (f) => f.character === currentKanji.kanji
  );

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white rounded-lg shadow-sm">
        <CardHeader className="text-center space-y-2">
          <div className="text-gray-600">
            Card {currentIndex + 1} of {kanjiList.length}
          </div>
          <div className="text-blue-500">Tap card to flip</div>
        </CardHeader>

        {/* Rest of the component remains the same */}
        {/* ... */}
      </Card>
    </div>
  );
}
