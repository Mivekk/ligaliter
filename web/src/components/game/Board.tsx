import React, { useContext, useEffect, useState } from "react";
import { useDragLayer } from "react-dnd";
import BoardBackground from "./BoardBackground";
import BoardForeground from "./BoardForeground";
import { TilesContext } from "@/contexts/tilesContext";
import { checkWords } from "@/utils/game/checkWords";

type BoardOffsetType = {
  x: number;
  y: number;
  xOffset: number;
  yOffset: number;
  lastXOffset: number;
  lastYOffset: number;
};

interface BoardProps {
  wordList: string[];
  setPlayPointCount: React.Dispatch<React.SetStateAction<number>>;
  setIsValid: React.Dispatch<React.SetStateAction<boolean>>;
}

const Board: React.FC<BoardProps> = ({
  wordList,
  setPlayPointCount,
  setIsValid,
}) => {
  const [zoom, setZoom] = useState(0.7);
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
  const { boardTiles } = useContext(TilesContext);

  const { currentOffset } = useDragLayer((monitor) => ({
    currentOffset: monitor.getSourceClientOffset(),
  }));

  useEffect(() => {
    setMouseHold(false);
    setTouchHold(false);
  }, [currentOffset !== null]);

  useEffect(() => {
    const points = checkWords(boardTiles, wordList);

    setPlayPointCount(points);
    setIsValid(points > 0);
  }, [boardTiles]);

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const scrollDir = event.deltaY;
    if ((zoom >= 1.2 && scrollDir < 0) || (zoom <= 0.5 && scrollDir > 0)) {
      return;
    }

    setZoom((prevZoom) => prevZoom + scrollDir * -0.001);
  };

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
    <div
      className="relative w-full h-screen flex justify-center 
        items-center touch-none"
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
      <div className="flex flex-wrap w-fit h-fit origin-center">
        <div
          className="absolute"
          onMouseDown={(event) => handleMouseDown(event)}
          onTouchStart={(event) => handleTouchDown(event)}
        >
          <BoardBackground />
        </div>
        <BoardForeground />
      </div>
    </div>
  );
};

export default Board;
