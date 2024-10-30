// src/data/kanjiData.js

export const kanjiData = {
  levels: [
    {
      id: "n5",
      name: "JLPT N5",
      chapters: [
        {
          chapter_number: 10,
          chapter_title: "Food and Drink (たべもの)",
          kanji_list: [
            {
              kanji: "魚",
              meaning: "Fish",
              readings: [
                {
                  hiragana: "うお",
                  romaji: "uo",
                  reading_type: "kunyomi",
                  example: {
                    japanese: "魚いちばは あさはやく はじまります。",
                    hiragana: "さかないちばは あさはやく はじまります。",
                    english: "The fish market starts early in the morning.",
                    usage_highlight: "うお",
                  },
                },
                {
                  hiragana: "ぎょ",
                  katakana: "ギョ",
                  romaji: "gyo",
                  reading_type: "onyomi",
                  example: {
                    japanese: "魚類が好きです。",
                    hiragana: "ぎょるいが すきです。",
                    english: "I like fish.",
                    usage_highlight: "ぎょ",
                  },
                },
              ],
            },
            {
              kanji: "雨",
              meaning: "Rain",
              readings: [
                {
                  hiragana: "あめ",
                  romaji: "ame",
                  reading_type: "kunyomi",
                  example: {
                    japanese: "雨が降っています。",
                    hiragana: "あめがふっています。",
                    english: "It is raining.",
                    usage_highlight: "あめ",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "n4",
      name: "JLPT N4",
      chapters: [
        {
          chapter_number: 1,
          chapter_title: "Weather (てんき)",
          kanji_list: [
            {
              kanji: "雨",
              meaning: "Rain",
              readings: [
                {
                  hiragana: "あめ",
                  romaji: "ame",
                  reading_type: "kunyomi",
                  example: {
                    japanese: "雨が降っています。",
                    hiragana: "あめがふっています。",
                    english: "It is raining.",
                    usage_highlight: "あめ",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
