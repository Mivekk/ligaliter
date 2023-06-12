import React, { useContext } from "react";

import { boardCenterId, boardSize } from "@/utils/game/constants";
import { tileBackground } from "@/utils/game/tileBackground";
import { AiFillStar } from "react-icons/ai";
import { TilesContext } from "@/contexts/tilesContext";
import { tileBag } from "@/utils/game/tileBag";

const BoardBackground: React.FC<{}> = () => {
  const { boardTiles } = useContext(TilesContext);

  const tilesElements = [];
  for (let i = 0; i < boardSize; i++) {
    const { text, color } = tileBackground(i);

    const displayText =
      i === boardCenterId ? (
        <AiFillStar className="w-8 h-8" />
      ) : (
        <div className="font-bold">{text}</div>
      );

    const letter = boardTiles[i].letter;

    const displayTile = (
      <div
        className="absolute sm:w-14 sm:h-14 w-[50px] h-[50px] flex justify-center items-center text-2xl
      border-[1px] shadow-[0px_2px_black] bg-[#ffaa00] border-black rounded-lg text-black"
      >
        {letter}
        <div className={"absolute top-0 right-1 text-sm"}>
          {letter && tileBag[letter].value !== -1
            ? tileBag[letter].value
            : null}
        </div>
      </div>
    );

    tilesElements.push(
      <div
        key={i}
        className={`flex justify-center items-center text-white sm:w-14 sm:h-14 
          w-[50px] h-[50px] ${color} border-[1px] border-white text-xl text-opacity-50`}
      >
        {boardTiles[i].placed ? displayTile : displayText}
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

export default React.memo(BoardBackground);
