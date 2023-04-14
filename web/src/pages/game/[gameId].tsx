import React from "react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "@/utils/createUrqlClient";
import ActivePlayers from "@/components/game/ActivePlayers";
import Board from "@/components/game/Board";
import TilesContextProvider from "@/contexts/tilesContext";

const Game: React.FC<{}> = ({}) => {
  return (
    <TilesContextProvider>
      <div className="bg-main w-full h-screen text-white overflow-hidden">
        <ActivePlayers />
        <div className="flex justify-center">
          <Board />
        </div>
      </div>
    </TilesContextProvider>
  );
};

export default withUrqlClient(createUrqlClient)(Game);
