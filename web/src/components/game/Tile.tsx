import { TilesContext } from "@/contexts/tilesContext";
import { MakingTurnDocument, MoveTileDocument } from "@/generated/graphql";
import {
  HandleDragType,
  HandleDropType,
  HandleWrongDropType,
  TileProps,
  TileType,
} from "@/types";
import { boardSize } from "@/utils/game/constants";
import React, { useContext, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useMutation, useQuery } from "urql";

const Tile: React.FC<TileProps> = ({
  id,
  letter,
  draggable,
  placed,
  gameId,
}) => {
  const { tileBag, playerTiles, setPlayerTiles, boardTiles, setBoardTiles } =
    useContext(TilesContext);

  const [, moveTile] = useMutation(MoveTileDocument);

  // set up function for drag event
  const handleDrag = (params: HandleDragType) => {
    const newBoardTiles = [...boardTiles];
    const newPlayerTiles = [...playerTiles];

    const curTile =
      params.id >= boardSize
        ? newPlayerTiles.find((item) => item.id === params.id)
        : newBoardTiles.find((item) => item.id === params.id);

    if (!curTile) {
      return new Error("tile not found");
    }

    curTile.letter = undefined;
    curTile.draggable = false;

    setBoardTiles(newBoardTiles);
    setPlayerTiles(newPlayerTiles);
  };

  // set up function for drop event
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
    } else if (toTile.letter && !toTile.draggable) {
      handleWrongDrop({ id: params.fromId, letter: params.letter });
      return;
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

    setBoardTiles(newBoardTiles);
    setPlayerTiles(newPlayerTiles);
  };

  // set up function for drop outside of accepted space
  const handleWrongDrop = (params: HandleWrongDropType) => {
    const newTiles = [...boardTiles];

    let curTile = newTiles.find((item) => item.id === params.id) as TileType;

    if (curTile !== undefined) {
      curTile.letter = params.letter;
      curTile.draggable = true;
    } else {
      // it's a player tile dropped onto a board tile
      const newPlayerTiles = [...playerTiles];

      curTile = newPlayerTiles.find(
        (item) => item.id === params.id
      ) as TileType;
      curTile.letter = params.letter;
      curTile.draggable = true;

      setPlayerTiles(newPlayerTiles);
    }

    setBoardTiles(newTiles);
  };

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
        handleWrongDrop({ id: item.id, letter: item.letter! });
      }
    },
  });

  // on drag start execute code inside useEffect
  useEffect(() => {
    if (isDragging) {
      handleDrag({ id: id });
    }
  }, [isDragging]);

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
      ref={(node) => {
        draggable ? drag(node!) : null, drop(node!);
      }}
      className={`relative w-14 h-14 flex justify-center items-center text-2xl
       border-[1px] shadow-[0px_2px_black] border-black rounded-lg`}
      style={{
        opacity: letter ? 1.0 : 0.0,
        backgroundColor: placed ? "orange" : draggable ? "yellow" : "lightgrey",
      }}
    >
      {letter}
      <div className={"absolute top-0 right-1 text-sm"}>
        {letter && tileBag[`${letter}`].value !== -1
          ? tileBag[`${letter}`].value
          : null}
      </div>
    </div>
  );
};

export default Tile;
