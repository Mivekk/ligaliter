import React from "react";

import { boardCenterId, boardLength, boardSize } from "@/utils/game/constants";
import { tileBackground } from "@/utils/game/tileBackground";
import { AiFillStar } from "react-icons/ai";

const BoardDisplay: React.FC<{}> = () => {
  // create an array of empty divs that look like empty tile
  const tilesElements = [];
  for (let i = 0; i < boardSize; i++) {
    const { text, color } = tileBackground(i);

    const displayText =
      i === boardCenterId ? (
        <AiFillStar className="w-8 h-8" />
      ) : (
        <div>{text}</div>
      );

    tilesElements.push(
      <div
        key={i}
        className={`flex justify-center items-center text-white sm:w-14 sm:h-14 
          w-[50px] h-[50px] ${color} border-[1px] border-white font-bold text-xl text-opacity-50`}
      >
        {displayText}
      </div>
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
