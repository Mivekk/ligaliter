import { TilesContext } from "@/contexts/tilesContext";
import { TileType } from "@/types";
import { boardSize, playerTilesAmount } from "@/utils/game/constants";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { useQuery } from "urql";
import Tile from "./Tile";
import TileDropArea from "./TileDropArea";
import { GetPlayerTilesDocument } from "@/generated/graphql";

const PlayerTiles: React.FC<{}> = () => {
  const router = useRouter();
  const gameId = router.query.gameId as string;

  const { playerTiles, setPlayerTiles } = useContext(TilesContext);

  const [{ data: queryData, fetching }] = useQuery({
    query: GetPlayerTilesDocument,
    variables: { uuid: gameId },
  });

  // generate random letters on first render
  useEffect(() => {
    if (!queryData?.getPlayerTiles) {
      return;
    }

    const newPlayerTiles: TileType[] = [];
    for (let i = 0; i < playerTilesAmount; i++) {
      newPlayerTiles[i] = {
        id: i + boardSize,
        draggable: false,
        placed: false,
      };
    }

    queryData?.getPlayerTiles.forEach((tile) => {
      newPlayerTiles[tile.id - boardSize].letter = tile.letter;
      newPlayerTiles[tile.id - boardSize].draggable = tile.draggable;
    });

    setPlayerTiles(newPlayerTiles);
  }, [queryData, fetching]);

  const tilesElements = playerTiles.map((item) => (
    <TileDropArea key={item.id} gameId={gameId} id={item.id}>
      <Tile
        key={item.id}
        id={item.id}
        letter={item.letter}
        draggable={item.draggable}
        placed={item.placed}
        gameId={gameId}
      />
    </TileDropArea>
  ));

  return (
    <div className={"flex justify-center items-center"}>{tilesElements}</div>
  );
};

export default PlayerTiles;
