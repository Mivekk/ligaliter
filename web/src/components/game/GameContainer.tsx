import { TilesContext } from "@/contexts/tilesContext";
import {
  GetPlayerStatsDocument,
  UpdatePlayerStatsDocument,
} from "@/generated/graphql";
import { checkWords } from "@/utils/checkWords";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { useQuery, useSubscription } from "urql";
import Wrapper from "../Wrapper";
import ActiveIndicator from "./ActiveIndicator";
import ActivePlayers from "./ActivePlayers";
import BoardDisplay from "./BoardDisplay";
import PlayerMenu from "./PlayerMenu";
import Board from "./Board";

interface ContainerProps {
  wordList: string[];
}

const GameContainer: React.FC<ContainerProps> = ({ wordList }) => {
  const router = useRouter();
  const gameId = router.query.gameId as string;

  const [{ data: queryData }] = useQuery({
    query: GetPlayerStatsDocument,
    variables: { uuid: gameId },
  });

  const [{ data: subscriptionData }] = useSubscription({
    query: UpdatePlayerStatsDocument,
    variables: { uuid: gameId },
  });

  const data = subscriptionData?.updatePlayerStats || queryData?.getPlayerStats;

  const { boardTiles, tileBag } = useContext(TilesContext);
  const [playPointCount, setPlayPointCount] = useState(0);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const res = checkWords(boardTiles, wordList, tileBag);

    setPlayPointCount(res.pointCount);
    setIsValid(res.areWordsValid);
  }, [boardTiles]);

  return (
    <Wrapper>
      <BoardDisplay />

      <Board />

      <ActiveIndicator data={data} />

      <ActivePlayers data={data} />

      <PlayerMenu
        data={data}
        isValid={isValid}
        playPointCount={playPointCount}
      />
    </Wrapper>
  );
};

export default GameContainer;
