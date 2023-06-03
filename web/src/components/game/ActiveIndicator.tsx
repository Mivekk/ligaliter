import {
  EndTurnDocument,
  GetRoundStartTimeDocument,
  MeDocument,
} from "@/generated/graphql";
import { roundTime } from "@/utils/game/constants";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "urql";

interface ActiveIndicatorProps {
  data:
    | {
        activePlayer: {
          id: number;
          username: string;
        };
      }
    | null
    | undefined;
}

const ActiveIndicator: React.FC<ActiveIndicatorProps> = ({ data }) => {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const [countdown, setCountdown] = useState(roundTime);

  const [{ data: queryData, fetching }, reexecuteQuery] = useQuery({
    query: GetRoundStartTimeDocument,
    variables: { uuid: router.query.gameId as string },
    requestPolicy: "network-only",
  });

  const [, endTurn] = useMutation(EndTurnDocument);

  useEffect(() => {
    reexecuteQuery();
  }, [data]);

  useEffect(() => {
    if (!queryData || fetching) {
      return;
    }

    const roundStartTime = new Date(queryData.getRoundStartTime);

    const currentTime = new Date();

    const timeElapsed = currentTime.getTime() - roundStartTime.getTime();

    setCountdown(roundTime - Math.floor(timeElapsed / 1000));
  }, [queryData, fetching, data]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          //endTurn({ input: { uuid: gameId, points: 0 } });

          return roundTime;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [gameId]);

  return (
    <div
      className="fixed sm:top-14 top-8 origin-center -translate-x-1/2 left-1/2 w-[14rem] shadow-lg
        h-10 text-xl rounded-b-xl bg-darker2 z-30 text-white flex justify-center items-center 
        sm:select-auto"
    >
      {data?.activePlayer.username} {countdown}
    </div>
  );
};

export default ActiveIndicator;
