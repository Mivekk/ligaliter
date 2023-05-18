import React from "react";

import { boardSize } from "@/utils/game/constants";

const BoardDisplay: React.FC<{}> = () => {
  // create an array of empty divs that look like empty tile
  const tilesElements = [];
  for (let i = 0; i < boardSize; i++) {
    tilesElements.push(
      <div
        key={i}
        className={"w-14 h-14 bg-secondary border-[1px] border-white"}
      />
    );
  }

  return (
    <div className="min-w-[1063px]" style={{ backfaceVisibility: "hidden" }}>
      <div className="grid grid-rows-19 grid-cols-19">{tilesElements}</div>
    </div>
  );
};

export default React.memo(BoardDisplay);
