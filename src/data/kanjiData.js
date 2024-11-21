import chapterOne from "./ChapterOne.json";
import chapterTwo from "./ChapterTwo.json";
  
export const kanjiData = {
  levels: [
    {
      id: "n5",
      name: "JLPT N5",
      chapters: [...chapterOne.chapters, ...chapterTwo.chapters]
    }
  ]
};
