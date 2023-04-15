import React from "react";

import { boardSize } from "@/utils/game/constants";

const BoardDisplay: React.FC<{}> = () => {
  // create an array of empty divs that look like empty tile
  const tilesElements = [];
  for (let i = 0; i < boardSize; i++) {
    tilesElements.push(<div key={i} className={"w-14 h-14 bg-secondary"} />);
  }

  return (
    <div className="grid grid-rows-19 grid-cols-19 gap-[0.125rem]">
      {tilesElements}
    </div>
  );
};

export default BoardDisplay;
