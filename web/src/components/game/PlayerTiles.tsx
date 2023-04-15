import React, { useContext, useEffect } from "react";

import { TilesContext } from "@/contexts/tilesContext";

import Tile from "./Tile";
import TileOverlay from "./TileOverlay";

import {
  HandleDragType,
  HandleDropType,
  HandleWrongDropType,
  TileType,
} from "@/types";
import { generateRandomLetter } from "@/utils/game/randomLetter";

const PlayerTiles: React.FC<{}> = () => {
  const {
    playerTiles,
    setPlayerTiles,
    boardTiles,
    setBoardTiles,
    tileBag,
    setTileBag,
  } = useContext(TilesContext);

  // generate random letters on first render
  useEffect(() => {
    // map through every tile and assign random letter
    // from utils/randomLetter function
    setPlayerTiles((prevTiles) => {
      return prevTiles.map((item) => ({
        ...item,
        letter: generateRandomLetter(tileBag, setTileBag),
      }));
    });
  }, []);

  // set up function for drag event
  const handleDrag = (params: HandleDragType) => {
    const newTiles = [...playerTiles];
    // when a letter is set to undefined opacity changes to 0 inside of <Tile />
    const curTile = newTiles.find((item) => item.id === params.id) as TileType;
    curTile.letter = undefined;
    curTile.draggable = false;

    setPlayerTiles(newTiles);
  };

  // set up function for drop event
  const handleDrop = (params: HandleDropType) => {
    const newTiles = [...playerTiles];

    let fromTile = newTiles.find(
      (item) => item.id === params.fromId
    ) as TileType;

    const endTile = newTiles.find(
      (item) => item.id === params.toId
    ) as TileType;

    // if fromTile is not undefined it is a player tile
    // because it's id was found in playerTiles array
    if (fromTile !== undefined) {
      fromTile.letter = endTile.letter;
      fromTile.draggable = true;
    } else {
      // it's a board tile
      const newBoardTiles = [...boardTiles];

      fromTile = newBoardTiles.find(
        (item) => item.id === params.fromId
      ) as TileType;
      fromTile.letter = endTile.letter;
      if (endTile.letter === undefined) {
        fromTile.draggable = false;
      } else {
        fromTile.draggable = true;
      }

      setBoardTiles(newBoardTiles);
    }

    endTile.draggable = true;
    endTile.letter = params.letter;

    setPlayerTiles(newTiles);
  };

  // set up function for drop outside of accepted space
  const handleWrongDrop = (params: HandleWrongDropType) => {
    const newTiles = [...playerTiles];
    // style is automatically correctly assigned
    const curTile = newTiles.find((item) => item.id === params.id) as TileType;
    curTile.letter = params.letter;
    curTile.draggable = true;

    setPlayerTiles(newTiles);
  };

  // map through player tiles and return <Tile /> inside of <TileOverlay />
  const tilesElements = playerTiles.map((item) => (
    <TileOverlay key={item.id} id={item.id} handleDrop={handleDrop}>
      <Tile
        key={item.id}
        id={item.id}
        letter={item.letter}
        draggable={item.draggable}
        handleDrop={handleDrop}
        handleWrongDrop={handleWrongDrop}
        handleDrag={handleDrag}
        styles={"rounded-xl bg-yellow-300 border-black"}
      />
    </TileOverlay>
  ));

  return (
    <div className={"flex justify-center items-center"}>{tilesElements}</div>
  );
};

export default PlayerTiles;
