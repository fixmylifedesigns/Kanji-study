// src/components/study/KanjiGame.js
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useKanji } from "@/context/KanjiContext";
import { useAuth } from "@/context/AuthContext";
import kanjiData from "@/data/kanjiData.js"; // For default deck

export function KanjiGame({ showRomaji = true, deck }) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);
  const [kanjiList, setKanjiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { updateStudyProgress } = useKanji();
  const { user } = useAuth();

  // Fetch deck content when component mounts
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
          readings: [{ hiragana: fav.reading }],
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
            readings: [{ hiragana: k.reading }],
          }));
        }
      }

      setKanjiList(kanjiArray);
      if (kanjiArray.length > 0) {
        setCurrentQuestion(getRandomQuestion(kanjiArray));
      }
    } catch (error) {
      console.error("Error fetching deck content:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRandomQuestion = (list) => {
    if (!list?.length) return null;

    const randomIndex = Math.floor(Math.random() * list.length);
    const randomKanji = list[randomIndex];

    if (!randomKanji?.readings?.length) return null;

    const readingIndex = Math.floor(
      Math.random() * randomKanji.readings.length
    );
    const randomReading = randomKanji.readings[readingIndex];

    return {
      kanji: randomKanji.kanji,
      hiragana: randomReading.hiragana,
      meaning: Array.isArray(randomKanji.meanings)
        ? randomKanji.meanings[0]
        : randomKanji.meaning,
    };
  };

  const handleAnswer = (selectedKanji) => {
    if (!currentQuestion) return;

    const correct = selectedKanji === currentQuestion.kanji;
    setTotalAttempts((prev) => prev + 1);
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 1);
      if (updateStudyProgress) {
        updateStudyProgress(selectedKanji, true);
      }

      // Update question after showing feedback
      setTimeout(() => {
        setIsCorrect(null);
        setCurrentQuestion(getRandomQuestion(kanjiList));
      }, 1000);
    } else {
      if (updateStudyProgress) {
        updateStudyProgress(selectedKanji, false);
      }

      setTimeout(() => {
        setIsCorrect(null);
      }, 1000);
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardContent className="p-6 text-center text-gray-600">
          Loading game...
        </CardContent>
      </Card>
    );
  }

  if (kanjiList.length < 4) {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardContent className="p-6 text-center text-gray-600">
          Need at least 4 kanji to play the game. Add more kanji to your{" "}
          {deck.type === "favorites" ? "favorites" : "deck"}.
        </CardContent>
      </Card>
    );
  }

  if (!currentQuestion) {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardContent className="p-6 text-center text-gray-600">
          No valid questions available.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center space-y-2">
        <div className="text-xl font-bold">
          Score: {score} / {totalAttempts}
        </div>
        <div className="text-sm text-gray-600">
          {((score / (totalAttempts || 1)) * 100).toFixed(1)}% Correct
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-2xl mb-2">Match this reading:</div>
          <div className="text-4xl font-bold mb-4">
            {currentQuestion.hiragana}
          </div>
          <div className="text-lg text-gray-600 mb-4">
            ({currentQuestion.meaning})
          </div>
        </div>

        {isCorrect !== null && (
          <div
            className={`text-center text-lg font-bold ${
              isCorrect ? "text-green-500" : "text-red-500"
            }`}
          >
            {isCorrect ? "Correct!" : "Try again!"}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Show 4 random kanji including the correct one */}
          {getGameChoices(kanjiList, currentQuestion.kanji).map(
            (kanji, index) => (
              <button
                key={`${kanji}-${index}`}
                onClick={() => handleAnswer(kanji)}
                className={`p-4 text-3xl bg-white border-2 rounded-lg 
                        transition-all duration-200 ${
                          isCorrect !== null && kanji === currentQuestion.kanji
                            ? "border-green-500 bg-green-50"
                            : isCorrect === false &&
                              kanji === currentQuestion.kanji
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 hover:bg-blue-50 hover:border-blue-300"
                        }`}
              >
                {kanji}
              </button>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to get 4 random choices including the correct answer
function getGameChoices(kanjiList, correctKanji) {
  const choices = new Set([correctKanji]);

  // Add random unique choices until we have 4
  while (choices.size < 4) {
    const randomKanji =
      kanjiList[Math.floor(Math.random() * kanjiList.length)].kanji;
    choices.add(randomKanji);
  }

  // Convert to array and shuffle
  return shuffleArray([...choices]);
}

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
