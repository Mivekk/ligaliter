import React from "react";

import PlayerTiles from "./PlayerTiles";
import PlayButton from "./PlayButton";
import SkipButton from "./SkipButton";
import SwapButton from "./SwapButton";

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
      <div className="fixed bottom-28 flex gap-2 origin-center -translate-x-1/2 left-1/2">
        <div>
          <SwapButton />
        </div>
        <div>
          <PlayButton isValid={isValid} playPointCount={playPointCount} />
        </div>
        <div>
          <SkipButton />
        </div>
      </div>
    </>
  );
};

export default React.memo(PlayerMenu);
