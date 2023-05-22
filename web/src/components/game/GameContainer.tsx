import React, { useContext, useEffect, useState } from "react";
import { useDragLayer } from "react-dnd";

import { TilesContext } from "@/contexts/tilesContext";

import { checkWords } from "@/utils/checkWords";
import Board from "./Board";
import BoardDisplay from "./BoardDisplay";
import PlayerMenu from "./PlayerMenu";
import ActiveIndicator from "./ActiveIndicator";
import ActivePlayers from "./ActivePlayers";
import { useRouter } from "next/router";
import { useQuery, useSubscription } from "urql";
import {
  GetPlayerStatsDocument,
  UpdatePlayerStatsDocument,
} from "@/generated/graphql";
import Wrapper from "../Wrapper";

interface ContainerProps {
  wordList: string[];
}

type BoardOffsetType = {
  x: number;
  y: number;
  xOffset: number;
  yOffset: number;
  lastXOffset: number;
  lastYOffset: number;
};

const GameContainer: React.FC<ContainerProps> = ({ wordList }) => {
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

  const { boardTiles, tileBag } = useContext(TilesContext);
  const [playPointCount, setPlayPointCount] = useState(0);
  const [isValid, setIsValid] = useState(false);
  const [zoom, setZoom] = useState(1.0);
  const [mouseHold, setMouseHold] = useState(false);
  const [touchHold, setTouchHold] = useState(false);
  const [boardPosition, setBoardPosition] = useState<BoardOffsetType>({
    x: 0,
    y: 0,
    xOffset: 0,
    yOffset: 0,
    lastXOffset: 0,
    lastYOffset: 0,
  });

  const { currentOffset } = useDragLayer((monitor) => ({
    currentOffset: monitor.getSourceClientOffset(),
  }));

  useEffect(() => {
    setMouseHold(false);
    setTouchHold(false);
  }, [currentOffset !== null]);

  // look for valid words that player put on board
  useEffect(() => {
    const res = checkWords(boardTiles, wordList, tileBag);

    setPlayPointCount(res.pointCount);
    setIsValid(res.areWordsValid);
  }, [boardTiles]);

  // handle board zooming
  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const scrollDir = event.deltaY;
    if ((zoom >= 1.5 && scrollDir < 0) || (zoom <= 0.5 && scrollDir > 0)) {
      return;
    }

    setZoom((prevZoom) => prevZoom + scrollDir * -0.001);
  };

  // handle when player presses on board
  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    setBoardPosition((prevBoardPos) => ({
      ...prevBoardPos,
      x: event.clientX,
      y: event.clientY,
      lastXOffset: prevBoardPos.xOffset,
      lastYOffset: prevBoardPos.yOffset,
    }));
    setMouseHold(true);
  };

  const handleTouchDown = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];

    setBoardPosition((prevBoardPos) => ({
      ...prevBoardPos,
      x: touch.clientX,
      y: touch.clientY,
      lastXOffset: prevBoardPos.xOffset,
      lastYOffset: prevBoardPos.yOffset,
    }));
    setTouchHold(true);
  };

  // handle board movement
  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!mouseHold) {
      return;
    }

    setBoardPosition((prevBoardPos) => ({
      ...prevBoardPos,
      xOffset: prevBoardPos.lastXOffset + event.clientX - prevBoardPos.x,
      yOffset: prevBoardPos.lastYOffset + event.clientY - prevBoardPos.y,
    }));
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!touchHold) {
      return;
    }

    const touch = event.touches[0];
    setBoardPosition((prevBoardPos) => ({
      ...prevBoardPos,
      xOffset: prevBoardPos.lastXOffset + touch.clientX - prevBoardPos.x,
      yOffset: prevBoardPos.lastYOffset + touch.clientY - prevBoardPos.y,
    }));
  };

  return (
    <Wrapper>
      <div
        className="relative w-full h-screen flex justify-center items-center m-0 p-0 z-0"
        onMouseUp={() => setMouseHold(false)}
        onTouchEnd={() => setTouchHold(false)}
        onMouseMove={(event) => handleMouseMove(event)}
        onTouchMove={(event) => handleTouchMove(event)}
        onWheel={(event) => handleWheel(event)}
        style={{
          top: boardPosition.yOffset,
          left: boardPosition.xOffset,
          transform: `scale(${zoom})`,
        }}
      >
        <div className="flex flex-wrap w-fit h-fit m-0 p-0 origin-center">
          <div
            className="absolute"
            onMouseDown={(event) => handleMouseDown(event)}
            onTouchStart={(event) => handleTouchDown(event)}
          >
            <BoardDisplay />
          </div>
          <Board />
        </div>
      </div>

      <ActiveIndicator data={data} />

      <ActivePlayers data={data} />

      <PlayerMenu
        data={data}
        isValid={isValid}
        playPointCount={playPointCount}
      />
    </Wrapper>
  );
};

export default GameContainer;
