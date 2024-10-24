import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useKanji } from '@/context/KanjiContext';
import { cn } from '@/lib/utils';
import kanjiData from '@/data/kanjiData.json'; // Assuming your kanji data is here

export function KanjiFlashcard({ showRomaji = true }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedReading, setSelectedReading] = useState(0);
  const { favorites = [], addToFavorites, removeFromFavorites } = useKanji() || {};

  // Flattening the chapters and kanji data into one array
  const kanjiList = kanjiData.chapters.flatMap(chapter => chapter.kanji_list);
  const totalKanji = kanjiList.length;
  const kanji = kanjiList[currentIndex] || {}; // Getting the current kanji based on index

  const isFavorited = favorites.some(f => f.character === kanji.kanji);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    if (!addToFavorites || !removeFromFavorites) return;

    if (isFavorited) {
      removeFromFavorites({ character: kanji.kanji });
    } else {
      addToFavorites({ character: kanji.kanji, meaning: kanji.meaning, readings: kanji.readings });
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    setSelectedReading(0); // Reset the reading when navigating to the next card
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalKanji); // Cycle through kanji
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setSelectedReading(0); // Reset the reading when navigating to the previous card
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalKanji) % totalKanji); // Ensure the index loops around
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white rounded-lg shadow-sm">
        {/* Card Header */}
        <CardHeader className="text-center space-y-2">
          <div className="text-gray-600">
            Card {currentIndex + 1} of {totalKanji}
          </div>
          <div className="text-blue-500">
            Tap card to flip
          </div>
        </CardHeader>

        {/* Card Content */}
        <CardContent>
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className={cn(
              "relative min-h-[300px] cursor-pointer",
              "border-2 border-gray-100 rounded-lg",
              "transition-all duration-500",
              "kanji-card",
              isFlipped && "flipped"
            )}
          >
            {/* Front of card */}
            <div className="kanji-card-front absolute inset-0">
              <button
                onClick={toggleFavorite}
                className="absolute top-4 right-4 text-yellow-500 hover:text-yellow-600"
              >
                {isFavorited ? '★' : '☆'}
              </button>
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-8xl mb-4">{kanji.kanji}</div>
                <div className="text-xl text-gray-600">{kanji.meaning}</div>
              </div>
            </div>

            {/* Back of card */}
            <div className="kanji-card-back absolute inset-0">
              <div className="p-6 space-y-4">
                {Array.isArray(kanji.readings) && kanji.readings.map((reading, idx) => (
                  <div
                    key={`reading-${idx}`}
                    className={cn(
                      "p-3 rounded transition-colors",
                      selectedReading === idx ? "bg-blue-50" : "hover:bg-gray-50"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedReading(idx);
                    }}
                  >
                    <div className="text-lg font-bold">
                      {reading.hiragana || ''}
                    </div>
                    {showRomaji && (
                      <div className="text-sm text-gray-600">
                        {reading.romaji || ''}
                      </div>
                    )}
                    <div className="mt-2 text-sm">
                      <div>{reading.example_sentence || ''}</div>
                      <div className="text-gray-600 mt-1">
                        {reading.english_translation || ''}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <button
              onClick={handlePrevious}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg 
                       hover:bg-blue-600 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg 
                       hover:bg-blue-600 transition-colors"
            >
              Next
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
