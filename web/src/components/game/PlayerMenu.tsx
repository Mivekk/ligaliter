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
    <>
      <div
        className={
          "fixed bottom-5 origin-center -translate-x-1/2 left-1/2 w-[34rem] h-20 rounded-xl bg-zinc-600/50"
        }
      >
        <PlayerTiles />
      </div>
      <div className="fixed bottom-28 flex items-end gap-2 origin-center -translate-x-1/2 left-1/2">
        <div>
          <SwapButton myTurn={isMyTurn} />
        </div>
        <div>
          <PlayButton isValid={isValid} playPointCount={playPointCount} />
        </div>
        <div>
          <PassButton myTurn={isMyTurn} />
        </div>
      </div>
    </>
  );
};

export default PlayerMenu;
