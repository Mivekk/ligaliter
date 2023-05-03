import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useQuery, useSubscription } from "urql";
import Heading from "../Heading";
import {
  GetPlayerStatsDocument,
  UpdatePlayerStatsDocument,
} from "@/generated/graphql";

const ActivePlayers: React.FC<{}> = () => {
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

  const players = data?.players.map((item) => (
    <div key={item.id}>
      {item.username} {item.points}
    </div>
  ));

  return (
    <div
      className="fixed flex flex-col items-center z-40 bg-darker1 text-white rounded-xl 
         w-52 h-40 top-20 right-8 shadow-lg"
    >
      <Heading>Players</Heading>
      {players}
    </div>
  );
};

export default ActivePlayers;
