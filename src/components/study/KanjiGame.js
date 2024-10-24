import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useKanji } from "@/context/KanjiContext";
import kanjiData from '@/data/kanjiData.json'; // Assuming your kanji data is stored here

export function KanjiGame() {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);
  const { updateStudyProgress } = useKanji() || {};

  // Filter the kanji list to only include Chapter 1 (Numbers)
  const kanjiList = kanjiData.chapters.find(chapter => chapter.chapter_number === 1)?.kanji_list || [];

  // Use useRef for random selection to avoid hydration mismatch
  const getRandomQuestion = useRef(() => {
    if (!kanjiList.length) return null;

    const randomIndex = Math.floor(Math.random() * kanjiList.length);
    const randomKanji = kanjiList[randomIndex];

    if (!randomKanji?.readings?.length) return null;

    const readingIndex = Math.floor(
      Math.random() * randomKanji.readings.length
    );
    const randomReading = randomKanji.readings[readingIndex];

    return {
      kanji: randomKanji.kanji,
      hiragana: randomReading.hiragana,
      example_sentence: randomReading.example_sentence,
      full_hiragana: randomReading.full_hiragana,
      english_translation: randomReading.english_translation,
      meaning: randomKanji.meaning,
    };
  }).current;

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
      const timeoutId = setTimeout(() => {
        setIsCorrect(null);
        setCurrentQuestion(getRandomQuestion());
      }, 1000);

      return () => clearTimeout(timeoutId);
    } else {
      if (updateStudyProgress) {
        updateStudyProgress(selectedKanji, false);
      }

      const timeoutId = setTimeout(() => {
        setIsCorrect(null);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  };

  // Initialize question on client-side only
  useEffect(() => {
    if (kanjiList.length > 0 && !currentQuestion) {
      setCurrentQuestion(getRandomQuestion());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kanjiList]);

  if (!currentQuestion || !kanjiList.length) {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardContent className="p-6 text-center text-gray-600">
          Loading game...
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
          <div className="text-sm mb-2">{currentQuestion.full_hiragana}</div>
          <div className="text-sm text-gray-600">
            {currentQuestion.english_translation}
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
          {kanjiList.map((item, index) => (
            <button
              key={`kanji-choice-${index}`}
              onClick={() => handleAnswer(item.kanji)}
              className={`p-4 text-3xl bg-white border-2 rounded-lg 
                        transition-all duration-200 ${
                          isCorrect !== null &&
                          item.kanji === currentQuestion.kanji
                            ? "border-green-500 bg-green-50"
                            : isCorrect === false &&
                              item.kanji === currentQuestion.kanji
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 hover:bg-blue-50 hover:border-blue-300"
                        }`}
            >
              {item.kanji}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
