import chapterOne from "./chapterOne.json;
import chapterTwo from "./chapterTwo.json;
  
export const kanjiData = {
  levels: [
    {
      id: "n5",
      name: "JLPT N5",
      chapters: [...chapterOne.chapters, ...chapterTwo.chapters]
    }
  ]
};
