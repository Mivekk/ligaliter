import React, { useContext, useEffect, useState } from "react";

import { TilesContext } from "@/contexts/tilesContext";

import Tile from "./Tile";
import TileDropArea from "./TileDropArea";

import {
  GetTilesQueryDocument,
  MeDocument,
  MoveTileDocument,
} from "@/generated/graphql";
import {
  HandleDragType,
  HandleDropType,
  HandleWrongDropType,
  TileType,
} from "@/types";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "urql";
import { boardSize, playerTilesAmount } from "@/utils/game/constants";

const PlayerTiles: React.FC<{}> = () => {
  const router = useRouter();
  const gameId = router.query.gameId as string;

  const { boardTiles, setBoardTiles } = useContext(TilesContext);
  const [playerTiles, setPlayerTiles] = useState<TileType[]>([]);

  const [{ data, fetching }] = useQuery({
    query: GetTilesQueryDocument,
    variables: { uuid: gameId },
    requestPolicy: "cache-and-network",
  });

  const [, moveTile] = useMutation(MoveTileDocument);

  // generate random letters on first render
  useEffect(() => {
    if (!data?.getTilesQuery) {
      return;
    }

    const newPlayerTiles: TileType[] = [];
    for (let i = 0; i < playerTilesAmount; i++) {
      newPlayerTiles[i] = {
        id: i + boardSize,
        draggable: true,
      };
    }

    data.getTilesQuery.forEach((tile) => {
      newPlayerTiles[tile.id - boardSize] = tile;
    });

    setPlayerTiles(newPlayerTiles);
  }, [data, fetching]);

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

    // moveTiles
    moveTile({
      input: {
        uuid: router.query.gameId as string,
        fromId: fromTile.id,
        toId: endTile.id,
      },
    });

    setPlayerTiles(newTiles);
  };

  // set up function for drop outside of accepted space
  const handleWrongDrop = (params: HandleWrongDropType) => {
    const newTiles = [...playerTiles];

    const curTile = newTiles.find((item) => item.id === params.id) as TileType;
    curTile.letter = params.letter;
    curTile.draggable = true;

    setPlayerTiles(newTiles);
  };

  const tilesElements = playerTiles.map((item) => (
    <TileDropArea key={item.id} id={item.id} handleDrop={handleDrop}>
      <Tile
        key={item.id}
        id={item.id}
        letter={item.letter}
        draggable={item.draggable}
        handleDrop={handleDrop}
        handleWrongDrop={handleWrongDrop}
        handleDrag={handleDrag}
      />
    </TileDropArea>
  ));

  return (
    <div className={"flex justify-center items-center"}>{tilesElements}</div>
  );
};

export default PlayerTiles;
