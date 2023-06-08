import {
  doubleLetter,
  doubleWord,
  tripleLetter,
  tripleWord,
} from "../specialTiles";

export const tileBackground = (id: number): { text: string; color: string } => {
  const doubleWordTile = doubleWord.find((val) => val === id);
  const tripleWordTile = tripleWord.find((val) => val === id);
  const doubleLetterTile = doubleLetter.find((val) => val === id);
  const tripleLetterTile = tripleLetter.find((val) => val === id);

  let color = "bg-secondary";
  let text = "";
  if (tripleWordTile !== undefined) {
    color = "bg-[#FF006E]";
    text = "3W";
  } else if (doubleLetterTile !== undefined) {
    color = "bg-[#3A86FF]";
    text = "2L";
  } else if (tripleLetterTile !== undefined) {
    color = "bg-[#FFBE0B]";
    text = "3L";
  } else if (doubleWordTile !== undefined) {
    color = "bg-[#FB5607]";
    text = "2W";
  }

  return { text, color };
};
