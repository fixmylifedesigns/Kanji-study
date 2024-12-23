import chapterOne from "./N5/ChapterOne.json";
import chapterTwo from "./N5/ChapterTwo.json";
  
export const kanjiData = {
  levels: [
    {
      id: "n5",
      name: "JLPT N5",
      chapters: [...chapterOne.chapters, ...chapterTwo.chapters]
    },
    {
      id: "n4",
      name: "JLPT N4",
      chapters: [...chapterOne.chapters, ...chapterTwo.chapters]
    }
  ]
};
