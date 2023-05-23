import { TilesContext } from "@/contexts/tilesContext";
import { MoveTileDocument } from "@/generated/graphql";
import { HandleDropType } from "@/types";
import { boardSize } from "@/utils/game/constants";
import React, { useContext } from "react";
import { useDrop } from "react-dnd";
import { useMutation } from "urql";

interface TileDropAreaProps {
  children: React.ReactNode;
  gameId: string;
  id: number;
}

const TileDropArea: React.FC<TileDropAreaProps> = ({
  children,
  gameId,
  id,
}) => {
  const { boardTiles, playerTiles, setPlayerTiles } = useContext(TilesContext);

  const [, moveTile] = useMutation(MoveTileDocument);

  const handleDrop = (params: HandleDropType) => {
    const newBoardTiles = [...boardTiles];
    const newPlayerTiles = [...playerTiles];

    const fromTile =
      params.fromId >= boardSize
        ? newPlayerTiles.find((tile) => tile.id === params.fromId)
        : newBoardTiles.find((tile) => tile.id === params.fromId);

    const toTile =
      params.toId >= boardSize
        ? newPlayerTiles.find((tile) => tile.id === params.toId)
        : newBoardTiles.find((tile) => tile.id === params.toId);

    // error handling
    if (!fromTile || !toTile) {
      return new Error("tile error");
    }

    if (toTile.letter) {
      [fromTile.letter, toTile.letter] = [toTile.letter, params.letter];
      fromTile.draggable = true;
    } else {
      fromTile.letter = undefined;
      fromTile.draggable = false;

      toTile.letter = params.letter;
      toTile.draggable = true;
    }

    // server moveTiles
    moveTile({
      input: {
        uuid: gameId,
        fromId: fromTile.id,
        toId: toTile.id,
      },
    });

    setPlayerTiles(newPlayerTiles);
  };

  // set up drop hook
  const [, drop] = useDrop({
    accept: "tile",
    drop(item: { id: number; letter: string }, monitor) {
      if (!monitor.canDrop()) {
        return;
      }

      handleDrop({ fromId: item.id, toId: id, letter: item.letter });
    },
  });

  return (
    <div
      ref={drop}
      className={"sm:border-8 border-[0.5px] border-y-8 border-transparent"}
    >
      {children}
    </div>
  );
};

export default TileDropArea;
