import React, { useContext } from "react";
import { TilesContext } from "@/contexts/tilesContext";

import { generateRandomLetter } from "@/utils/game/randomLetter";

interface PlayButtonProps {
  isValid: boolean;
  playPointCount: number;
}

const PlayButton: React.FC<PlayButtonProps> = ({ isValid, playPointCount }) => {
  const { boardTiles, setBoardTiles, setPlayerTiles, tileBag, setTileBag } =
    useContext(TilesContext);

  const handleOnClick = () => {
    const newTiles = [...boardTiles];

    newTiles.map((item) => {
      if (item.draggable) {
        item.draggable = false;
      }
    });

    // map through every empty tile and assign random letter
    // from utils/randomLetter function
    setPlayerTiles((prevTiles) => {
      return prevTiles.map((item) => {
        if (item.letter === undefined) {
          return {
            ...item,
            letter: generateRandomLetter(tileBag, setTileBag),
            draggable: true,
          };
        } else {
          return item;
        }
      });
    });

    setBoardTiles(newTiles);
  };

  return (
    <div
      onClick={handleOnClick}
      className={`flex flex-col items-center text-white text-2xl justify-center select-none  ${
        isValid
          ? "w-52 h-20 flex-col bg-violet-600 rounded-xl hover:opacity-75 cursor-pointer"
          : "w-52 h-10 bg-gray-400"
      }`}
    >
      <div>PLAY</div>
      <div>{isValid ? `${playPointCount} PTS` : null}</div>
    </div>
  );
};

export default PlayButton;
