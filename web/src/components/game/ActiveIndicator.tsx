import {
  GetPlayerStatsDocument,
  UpdatePlayerStatsDocument,
} from "@/generated/graphql";
import { useRouter } from "next/router";
import React from "react";
import { useQuery, useSubscription } from "urql";

const ActiveIndicator: React.FC<{}> = ({}) => {
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

  return (
    <div
      className="fixed top-14 origin-center -translate-x-1/2 left-1/2 w-[14rem] shadow-lg
        h-10 text-xl rounded-b-xl bg-darker2 z-30 text-white flex justify-center items-center"
    >
      {data?.activePlayer.username}
    </div>
  );
};

export default ActiveIndicator;
