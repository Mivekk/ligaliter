import React from "react";

import PlayerTiles from "./PlayerTiles";
import PlayButton from "./PlayButton";

interface PlayerMenuProps {
  isValid: boolean;
  playPointCount: number;
}

const PlayerMenu: React.FC<PlayerMenuProps> = ({ isValid, playPointCount }) => {
  return (
    <>
      <div
        className={
          "fixed bottom-5 origin-center -translate-x-1/2 left-1/2 w-[34rem] h-20 rounded-xl bg-zinc-600/50"
        }
      >
        <PlayerTiles />
      </div>
      <div
        className={`fixed bottom-28 origin-center -translate-x-1/2 left-1/2 text-white text-2xl flex justify-center items-center select-none  ${
          isValid
            ? "w-52 h-20 flex-col bg-violet-600 rounded-xl"
            : "w-52 h-10 bg-gray-400"
        }`}
      >
        <PlayButton isValid={isValid} playPointCount={playPointCount} />
      </div>
    </>
  );
};

export default PlayerMenu;
