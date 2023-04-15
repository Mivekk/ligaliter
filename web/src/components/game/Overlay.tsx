import React from "react";

import { boardSize } from "@/utils/game/constants";

interface OverlayProps {}

const Overlay: React.FC<OverlayProps> = () => {
  // create an array of empty divs that look like empty tile
  const tilesElements = [];
  for (let i = 0; i < boardSize; i++) {
    tilesElements.push(<div key={i} className={"w-10 h-10 bg-secondary"} />);
  }

  return (
    <div className="flex gap-[0.125rem] flex-wrap max-w-[49.75rem]">
      {tilesElements}
    </div>
  );
};

export default Overlay;
