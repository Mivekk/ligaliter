import { EndTurnDocument } from "@/generated/graphql";
import { useRouter } from "next/router";
import React from "react";
import { useMutation } from "urql";

interface SwapButtonProps {
  myTurn: boolean | undefined;
}

const SwapButton: React.FC<SwapButtonProps> = ({ myTurn }) => {
  const router = useRouter();
  const gameId = router.query.gameId as string;

  const [, endTurn] = useMutation(EndTurnDocument);

  const handleOnClick = () => {
    if (!myTurn) {
      return;
    }

    endTurn({ input: { uuid: gameId, points: -1 } });
  };

  return (
    <div
      onClick={handleOnClick}
      className={`flex flex-col items-center text-white text-2xl 
            justify-center select-none w-40 h-10 ${
              myTurn
                ? "bg-violet-600 hover:opacity-75 cursor-pointer"
                : "bg-gray-400"
            }`}
    >
      <div>SWAP</div>
    </div>
  );
};

export default SwapButton;
