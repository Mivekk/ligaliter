import React from "react";
import { useDrop } from "react-dnd";

import { HandleDropType } from "@/types";

interface TileOverlayProps {
  children: React.ReactNode;
  id: number;
  handleDrop: (params: HandleDropType) => void;
}

const TileOverlay: React.FC<TileOverlayProps> = ({
  children,
  id,
  ...props
}) => {
  // set up drop hook
  const [, drop] = useDrop({
    accept: "tile",
    drop(item: { id: number; letter: string }, monitor) {
      if (!monitor.canDrop()) {
        return;
      }

      props.handleDrop({ fromId: item.id, toId: id, letter: item.letter });
    },
  });

  return (
    <div ref={drop} className={"border-8"}>
      {children}
    </div>
  );
};

export default TileOverlay;
