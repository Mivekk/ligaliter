import React, { useContext, useEffect, useState } from "react";
import { useDragLayer } from "react-dnd";

import { TilesContext } from "@/contexts/tilesContext";

import { checkWords } from "@/utils/checkWords";
import Board from "./Board";
import BoardDisplay from "./BoardDisplay";
import PlayerMenu from "./PlayerMenu";
import ActiveIndicator from "./ActiveIndicator";
import ActivePlayers from "./ActivePlayers";

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
  const { boardTiles, tileBag } = useContext(TilesContext);
  const [playPointCount, setPlayPointCount] = useState(0);
  const [isValid, setIsValid] = useState(false);
  const [zoom, setZoom] = useState(1.0);
  const [mouseHold, setMouseHold] = useState(false);
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

  // as soon it detects drag event is happening
  // turn off moving the board
  useEffect(() => {
    setMouseHold(false);
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

  return (
    <>
      <div
        className={"absolute w-full h-screen"}
        onMouseUp={() => setMouseHold(false)}
        onMouseMove={(event) => handleMouseMove(event)}
        style={{ top: boardPosition.yOffset, left: boardPosition.xOffset }}
      >
        <div
          className={"flex items-center justify-center min-w-[1100px]"}
          onWheel={(event) => handleWheel(event)}
          style={{ transform: `scale(${zoom})` }}
        >
          <BoardDisplay />

          <div
            onMouseDown={(event) => handleMouseDown(event)}
            style={{ position: "absolute" }}
          >
            <Board />
          </div>
        </div>

        <ActiveIndicator />

        <ActivePlayers />

        <PlayerMenu isValid={isValid} playPointCount={playPointCount} />
      </div>
    </>
  );
};

export default GameContainer;
