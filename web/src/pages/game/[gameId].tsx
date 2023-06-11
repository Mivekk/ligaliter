import Wrapper from "@/components/Wrapper";
import ActiveIndicator from "@/components/game/ActiveIndicator";
import ActivePlayers from "@/components/game/ActivePlayers";
import Board from "@/components/game/Board";
import PlayerMenu from "@/components/game/PlayerMenu";
import TilesContextProvider from "@/contexts/tilesContext";
import {
  GetPlayerStatsDocument,
  UpdatePlayerStatsDocument,
} from "@/generated/graphql";
import { createUrqlClient } from "@/utils/createUrqlClient";
import { fetchWords } from "@/utils/game/fetchWords";
import { useAuth } from "@/utils/useAuth";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery, useSubscription } from "urql";

const Game: React.FC<{}> = ({}) => {
  const router = useRouter();
  const gameId = router.query.gameId as string;

  const [wordList, setWordList] = useState<string[]>([]);
  const [playPointCount, setPlayPointCount] = useState(0);
  const [isValid, setIsValid] = useState(false);

  const [{ data: queryData }] = useQuery({
    query: GetPlayerStatsDocument,
    variables: { uuid: gameId },
  });

  const [{ data: subscriptionData }] = useSubscription({
    query: UpdatePlayerStatsDocument,
    variables: { uuid: gameId },
  });

  const data = subscriptionData?.updatePlayerStats || queryData?.getPlayerStats;

  useEffect(() => {
    fetchWords(setWordList);
  }, []);

  useAuth();

  return (
    <TilesContextProvider>
      <Wrapper>
        <Board
          wordList={wordList}
          setPlayPointCount={setPlayPointCount}
          setIsValid={setIsValid}
        />

        <ActiveIndicator data={data} />

        <ActivePlayers data={data} />

        <PlayerMenu
          data={data}
          playPointCount={playPointCount}
          isValid={isValid}
        />
      </Wrapper>
    </TilesContextProvider>
  );
};

export default withUrqlClient(createUrqlClient)(Game);
