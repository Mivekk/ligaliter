import { TilesContext } from "@/contexts/tilesContext";
import {
  GetBoardTilesDocument,
  GetBoardTilesQueryDocument,
  MoveTileDocument,
} from "@/generated/graphql";
import {
  HandleDragType,
  HandleDropType,
  HandleWrongDropType,
  TileType,
} from "@/types";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { useMutation, useQuery, useSubscription } from "urql";
import Tile from "./Tile";
import { boardSize } from "@/utils/game/constants";

const Board: React.FC<{}> = () => {
  const router = useRouter();
  const gameId = router.query.gameId as string;

  const [, moveTile] = useMutation(MoveTileDocument);
  const { boardTiles, setBoardTiles, playerTiles, setPlayerTiles } =
    useContext(TilesContext);

  const [{ data: queryData }] = useQuery({
    query: GetBoardTilesQueryDocument,
    variables: { uuid: gameId },
  });

  const [{ data: subscriptionData }] = useSubscription({
    query: GetBoardTilesDocument,
    variables: { uuid: gameId },
  });

  // first fetch is query
  const data = subscriptionData?.getBoardTiles
    ? subscriptionData.getBoardTiles
    : queryData?.getBoardTilesQuery;

  useEffect(() => {
    if (!data) {
      return;
    }

    const newTiles: TileType[] = [];
    for (let i = 0; i < boardSize; i++) {
      newTiles[i] = {
        id: i,
        draggable: false,
      };
    }

    data.forEach((tile) => {
      newTiles[tile.id] = tile;
    });

    setBoardTiles(newTiles);
  }, [subscriptionData, queryData]);

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

    if (toTile !== undefined) {
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

    // moveTiles
    if (fromTile !== undefined) {
      moveTile({
        input: {
          uuid: gameId,
          fromId: fromTile.id,
          toId: toTile.id,
        },
      });
    }

    setBoardTiles(newTiles);
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

  const tilesElements = boardTiles.map((item) => (
    <Tile
      key={item.id}
      id={item.id}
      letter={item.letter}
      draggable={item.draggable}
      handleDrop={handleDrop}
      handleWrongDrop={handleWrongDrop}
      handleDrag={handleDrag}
    />
  ));

  return <div className="grid grid-rows-19 grid-cols-19">{tilesElements}</div>;
};

export default React.memo(Board);
