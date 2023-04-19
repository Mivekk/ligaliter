import Wrapper from "@/components/Wrapper";
import GameContainer from "@/components/game/GameContainer";
import TilesContextProvider from "@/contexts/tilesContext";
import { createUrqlClient } from "@/utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
import React, { useEffect, useState } from "react";

const Game: React.FC<{}> = ({}) => {
  const [wordList, setWordList] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        "https://raw.githubusercontent.com/jmlewis/valett/master/scrabble/sowpods.txt"
      );

      let text = await res.text();
      text = text.replaceAll("\r", "");

      setWordList(() => text.split("\n"));
    };

    fetchData();
  }, []);

  return (
    <TilesContextProvider>
      <Wrapper>
        <GameContainer wordList={wordList} />
      </Wrapper>
    </TilesContextProvider>
  );
};

export default withUrqlClient(createUrqlClient)(Game);
