import React, { useContext, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { TileProps } from "@/types";
import { TilesContext } from "@/contexts/tilesContext";

const Tile: React.FC<TileProps> = ({
  id,
  letter,
  draggable,
  styles,
  ...props
}) => {
  const { tileBag } = useContext(TilesContext);

  // set up drag hook
  const [{ isDragging }, drag] = useDrag({
    type: "tile",
    item: {
      id: id,
      letter: letter,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      if (!monitor.didDrop()) {
        props.handleWrongDrop({ id: item.id, letter: item.letter! });
      }
    },
  });

  // on drag start execute code inside useEffect
  useEffect(() => {
    if (isDragging) {
      props.handleDrag({ id: id });
    }
  }, [isDragging]);

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
    <div
      ref={(node) => {
        draggable ? drag(node!) : null, drop(node!);
      }}
      className={`relative w-14 h-14 bg-secondary flex justify-center items-center text-2xl border-[1px] shadow-[0px_2px_black] border-black rounded-lg ${styles}`}
      style={{
        opacity: letter ? 1.0 : 0.0,
        backgroundColor: draggable ? "yellow" : "orange",
      }}
    >
      {letter}
      <div className={"absolute top-0 right-1 text-sm"}>
        {letter ? tileBag[`${letter}`].value : null}
      </div>
    </div>
  );
};

export default Tile;
