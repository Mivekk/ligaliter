import React from "react";

import { boardSize } from "@/utils/game/constants";

const BoardDisplay: React.FC<{}> = () => {
  // create an array of empty divs that look like empty tile
  const tilesElements = [];
  for (let i = 0; i < boardSize; i++) {
    tilesElements.push(
      <div
        key={i}
        className={
          "sm:w-14 sm:h-14 w-[50px] h-[50px] bg-secondary border-[1px] border-white"
        }
      />
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
