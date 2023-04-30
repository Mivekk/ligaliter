import { MakingTurnDocument } from "@/generated/graphql";
import { useRouter } from "next/router";
import React, { useEffect, useMemo } from "react";
import { useQuery } from "urql";

const ActiveIndicator: React.FC<{}> = ({}) => {
  const router = useRouter();
  const gameId = router.query.gameId as string;

  const [{ data, fetching }] = useQuery({
    query: MakingTurnDocument,
    variables: { uuid: gameId },
  });

  useEffect(() => {
    console.log(data);
  }, [data, fetching]);

  return (
    <div
      className="fixed top-14 origin-center -translate-x-1/2 left-1/2 w-[14rem] 
        h-10 text-xl rounded-b-xl bg-darker2 z-30 text-white flex justify-center items-center"
    >
      {!fetching ? data?.makingTurn?.activePlayer : "..."}
    </div>
  );
};

export default ActiveIndicator;
