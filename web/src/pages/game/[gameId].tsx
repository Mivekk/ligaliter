import Container from "@/components/game/Container";
import TilesContextProvider from "@/contexts/tilesContext";
import { createUrqlClient } from "@/utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
import React from "react";

const Game: React.FC<{}> = ({}) => {
  return (
    <TilesContextProvider>
      <div>
        <Container wordList={[]} />
      </div>
    </TilesContextProvider>
  );
};

export default withUrqlClient(createUrqlClient)(Game);
