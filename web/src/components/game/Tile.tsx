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

  // if a tile is marked as draggable it has a drag ref
  // drop ref is always there
  // tile has two classnames: its main one and one from props
  // opacity is changed so the board looks better
  return (
    <div
      ref={(node) => {
        draggable ? drag(node!) : null, drop(node!);
      }}
      className={`${"w-10 h-10 bg-secondary"} ${styles}`}
      style={{
        opacity: letter ? 1.0 : 1.0,
        backgroundColor: draggable ? "yellow" : "orange",
      }}
    >
      {letter}
      <div className={""}>{letter ? tileBag[`${letter}`].value : null}</div>
    </div>
  );
};

export default Tile;
