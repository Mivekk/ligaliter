import React from "react";

import { MeDocument } from "@/generated/graphql";
import { useQuery } from "urql";
import PassButton from "./PassButton";
import PlayButton from "./PlayButton";
import PlayerTiles from "./PlayerTiles";
import SwapButton from "./SwapButton";

interface PlayerMenuProps {
  data:
    | {
        activePlayer: {
          id: number;
          username: string;
        };
      }
    | null
    | undefined;
  isValid: boolean;
  playPointCount: number;
}

const PlayerMenu: React.FC<PlayerMenuProps> = ({
  data,
  isValid,
  playPointCount,
}) => {
  const [{ data: meData }] = useQuery({
    query: MeDocument,
  });

  const isMyTurn =
    meData?.me && data?.activePlayer
      ? meData?.me?.id === data?.activePlayer.id
      : false;

  return (
    <div className="fixed bottom-2 origin-center w-fit -translate-x-1/2 left-1/2">
      <div className="flex justify-center gap-2">
        <div className="w-full">
          <SwapButton myTurn={isMyTurn} />
        </div>
        <div className="w-full">
          <PlayButton isValid={isValid} playPointCount={playPointCount} />
        </div>
        <div className="w-full">
          <PassButton myTurn={isMyTurn} />
        </div>
      </div>
      <div
        className={
          "sm:w-[34rem] w-fit flex max-w-[34rem] sm:h-20 h-18 px-1 rounded-xl bg-zinc-600/50 mt-2"
        }
      >
        <PlayerTiles />
      </div>
    </div>
  );
};

export default PlayerMenu;
