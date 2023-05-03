import { EndTurnDocument } from "@/generated/graphql";
import { useRouter } from "next/router";
import React from "react";
import { useMutation } from "urql";

interface PlayButtonProps {
  isValid: boolean;
  playPointCount: number;
}

const PlayButton: React.FC<PlayButtonProps> = ({ isValid, playPointCount }) => {
  const router = useRouter();
  const gameId = router.query.gameId as string;

  const [, endTurn] = useMutation(EndTurnDocument);

  const handleOnClick = () => {
    if (!isValid) {
      return;
    }

    endTurn({ input: { uuid: gameId, points: playPointCount } });
  };

  return (
    <div
      onClick={handleOnClick}
      className={`flex flex-col items-center text-white text-2xl justify-center select-none  ${
        isValid
          ? "w-52 h-20 flex-col bg-violet-600 rounded-xl hover:opacity-75 cursor-pointer"
          : "w-52 h-10 bg-gray-400"
      }`}
    >
      <div>PLAY</div>
      <div>{isValid ? `${playPointCount} PTS` : null}</div>
    </div>
  );
};

export default PlayButton;
