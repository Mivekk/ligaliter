import React, { useContext } from "react";
import { TilesContext } from "@/contexts/tilesContext";
import Tile from "./Tile";

import {
  HandleDragType,
  HandleDropType,
  HandleWrongDropType,
  TileType,
} from "@/types";

const Board: React.FC<{}> = () => {
  const { boardTiles, setBoardTiles, playerTiles, setPlayerTiles } =
    useContext(TilesContext);

  // set up function for drag event
  const handleDrag = (params: HandleDragType) => {
    const newTiles = [...boardTiles];
    // when a letter is set to undefined opacity changes to 0 inside of <Tile />
    const curTile = newTiles.find((item) => item.id === params.id) as TileType;
    curTile.letter = undefined;
    curTile.draggable = false;

    setBoardTiles(newTiles);
  };

  // set up function for drop event
  const handleDrop = (params: HandleDropType) => {
    const newTiles = [...boardTiles];

    let fromTile = newTiles.find(
      (item) => item.id === params.fromId
    ) as TileType;
    const toTile = newTiles.find((item) => item.id === params.toId) as TileType;

    // if tile is already occupied handle it
    // as it was a wrongDrop
    if (toTile.letter !== undefined && !toTile.draggable) {
      handleWrongDrop({ id: params.fromId, letter: params.letter });
      return;
    }

    if (toTile.letter !== undefined) {
      if (fromTile !== undefined) {
        // it's a board tile
        fromTile.letter = toTile.letter;
        fromTile.draggable = true;
      } else {
        // it's a player tile
        const newPlayerTiles = [...playerTiles];
        fromTile = newPlayerTiles.find(
          (item) => item.id === params.fromId
        ) as TileType;

        fromTile.letter = toTile.letter;
        fromTile.draggable = true;

        setPlayerTiles(newPlayerTiles);
      }
    }

    toTile.letter = params.letter;
    toTile.draggable = true;
    toTile.styles = "";

    setBoardTiles(newTiles);
  };

  // set up function for drop outside of accepted space
  const handleWrongDrop = (params: HandleWrongDropType) => {
    const newTiles = [...boardTiles];
    // style is automatically correctly assigned
    let curTile = newTiles.find((item) => item.id === params.id) as TileType;
    // if it's not undefined it is a board tile
    // because it's found in boardTiles array
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

  const tilesElements = boardTiles.map((item) => (
    <Tile
      key={item.id}
      id={item.id}
      letter={item.letter}
      draggable={item.draggable}
      handleDrop={handleDrop}
      handleWrongDrop={handleWrongDrop}
      handleDrag={handleDrag}
      styles={item.styles}
    />
  ));

  return (
    <div className="grid grid-rows-19 grid-cols-19 gap-[0.125rem]">
      {tilesElements}
    </div>
  );
};

export default React.memo(Board);
