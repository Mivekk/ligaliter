import React from "react";

import { boardSize } from "@/utils/game/constants";
import {
  doubleLetter,
  doubleWord,
  tripleLetter,
  tripleWord,
} from "@/utils/specialTiles";

const BoardDisplay: React.FC<{}> = () => {
  // create an array of empty divs that look like empty tile
  const tilesElements = [];
  for (let i = 0; i < boardSize; i++) {
    const doubleWordTile = doubleWord.find((val) => val === i);
    const tripleWordTile = tripleWord.find((val) => val === i);
    const doubleLetterTile = doubleLetter.find((val) => val === i);
    const tripleLetterTile = tripleLetter.find((val) => val === i);

    let color = "bg-secondary";
    if (tripleWordTile !== undefined) {
      color = "bg-[#FF006E]";
    } else if (doubleLetterTile !== undefined) {
      color = "bg-[#3A86FF]";
    } else if (tripleLetterTile !== undefined) {
      color = "bg-[#FFBE0B]";
    } else if (doubleWordTile !== undefined) {
      color = "bg-[#FB5607]";
    }

    tilesElements.push(
      <div
        key={i}
        className={`flex justify-center items-center text-white sm:w-14 sm:h-14 
          w-[50px] h-[50px] bg-secondary border-[1px] border-white`}
      ></div>
    );
  }

  return (
    <div
      className="sm:min-w-[1063px] min-w-[950px]"
      style={{ backfaceVisibility: "hidden" }}
    >
      <div className="grid grid-rows-19 grid-cols-19">{tilesElements}</div>
    </div>
  );
};

export default React.memo(BoardDisplay);
