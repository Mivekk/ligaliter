import { TilesContext } from "@/contexts/tilesContext";
import {
  GetBoardTilesDocument,
  MeDocument,
  UpdateBoardTilesDocument,
} from "@/generated/graphql";
import { TileType } from "@/types";
import { boardSize } from "@/utils/game/constants";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { useQuery, useSubscription } from "urql";
import Tile from "./Tile";

const Board: React.FC<{}> = () => {
  const router = useRouter();
  const gameId = router.query.gameId as string;

  const { boardTiles, setBoardTiles } = useContext(TilesContext);

  const [{ data: meData }] = useQuery({ query: MeDocument });

  const [{ data: queryData }] = useQuery({
    query: GetBoardTilesDocument,
    variables: { uuid: gameId },
  });

  const [{ data: subscriptionData }] = useSubscription({
    query: UpdateBoardTilesDocument,
    variables: { uuid: gameId },
  });

  // first fetch is query
  const data = subscriptionData?.updateBoardTiles || queryData?.getBoardTiles;

  useEffect(() => {
    if (!data) {
      return;
    }

    const newTiles: TileType[] = [];
    for (let i = 0; i < boardSize; i++) {
      newTiles[i] = {
        id: i,
        draggable: false,
        placed: false,
      };
    }

    data.forEach((tile) => {
      newTiles[tile.id] = tile;

      if (meData?.me && tile.userId !== meData.me.id && !tile.placed) {
        tile.letter = "?";
        tile.draggable = false;
      }
    });

    setBoardTiles(newTiles);
  }, [queryData, subscriptionData, meData]);

  const tilesElements = boardTiles.map((item) => (
    <Tile
      key={item.id}
      id={item.id}
      letter={item.letter}
      draggable={item.draggable}
      placed={item.placed}
      gameId={gameId}
    />
  ));

  return (
    <div className="absolute min-w-[1063px]">
      <div className="grid grid-rows-19 grid-cols-19">{tilesElements}</div>
    </div>
  );
};

export default React.memo(Board);
