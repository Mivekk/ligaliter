import React, { useContext, useEffect, useState } from "react";
import { useDragLayer } from "react-dnd";

import { TilesContext } from "@/contexts/tilesContext";

import Board from "./Board";
import Overlay from "./Overlay";
// import PlayerMenu from "./PlayerMenu";
import { TileBagType, TileType } from "@/types";
import { boardLength, boardSize } from "@/utils/game/constants";
import PlayerMenu from "./PlayerMenu";

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

// function to check whether words placed on the board are valid
const checkWordsValidity = (
  boardTiles: TileType[],
  wordList: string[],
  tileBag: TileBagType
): { areWordsValid: boolean; pointCount: number } => {
  // final return value
  let areWordsValid = true;

  // final point count
  let pointCount = 0;

  // create a set containing all unique words
  const words = new Set<string>();

  // is there any word there (it fixes a bug when player places 1 letter only)
  let anyWord = 0;

  boardTiles.map((item) => {
    if (!item.draggable) {
      return;
    }

    // look for starting id
    let wordStartId = item.id;
    // if item.id is not first from the left
    if (wordStartId % boardLength !== 0) {
      // look for word first id
      while (
        wordStartId % boardLength !== 0 &&
        boardTiles[wordStartId - 1].letter !== undefined
      ) {
        wordStartId--;
      }
    }
    // points got horizontally
    let horizontalCount = 0;

    // possible word
    let possibleWord: string[] = [];
    let currentId = wordStartId;
    // if wordStartId is not max to the right
    if (currentId % boardLength !== boardLength - 1) {
      while (boardTiles[currentId].letter !== undefined) {
        // push every letter to final word
        possibleWord.push(boardTiles[currentId].letter!);
        // add value of that letter to the horizontal sum
        horizontalCount += tileBag[`${boardTiles[currentId].letter!}`].value;

        // if currentId is on the right edge
        if (currentId % boardLength === boardLength - 1) {
          break;
        }

        currentId++;
      }
    }

    // if a word is shorter than 2 letter then
    // it's not considered as a valid word
    if (possibleWord.length > 1) {
      words.add(possibleWord.join(""));
      anyWord++;
    } else {
      // if it's not a word set a final point count to 0
      anyWord--;
      horizontalCount = 0;
    }
    possibleWord = [];

    // points got vertically
    let verticalCount = 0;

    // check vertically
    wordStartId = item.id;
    // when wordStartId is not on the top line
    if (wordStartId >= boardLength) {
      while (
        wordStartId >= boardLength &&
        boardTiles[wordStartId - boardLength].letter !== undefined
      ) {
        wordStartId -= boardLength;
      }
    }

    // if word is not on the bottom
    currentId = wordStartId;
    if (currentId <= boardSize - boardLength) {
      while (boardTiles[currentId].letter !== undefined) {
        // push every letter to final word
        possibleWord.push(boardTiles[currentId].letter!);
        // add value of that letter to the vertical sum
        verticalCount += tileBag[`${boardTiles[currentId].letter!}`].value;

        // if currentId is on the max bottom edge
        if (currentId > boardSize - boardLength) {
          break;
        }

        currentId += boardLength;
      }
    }

    // do not add empty words
    if (possibleWord.length > 1) {
      words.add(possibleWord.join(""));
      anyWord++;
    } else {
      verticalCount = 0;
      anyWord--;
    }

    // final point count is the sum of horizontal and vertical sum
    pointCount = horizontalCount + verticalCount;
  });

  words.forEach((word) => {
    // if any of the words are invalid everything is invalid
    if (wordList.find((element) => element === word) === undefined) {
      areWordsValid = false;
    }
  });

  // if there are no words final return value is false
  if (words.size === 0) {
    areWordsValid = false;
  }

  // if there are no words return false
  if (anyWord < 0) {
    areWordsValid = false;
  }

  return { areWordsValid, pointCount };
};

const Container: React.FC<ContainerProps> = ({ wordList }) => {
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
    const res = checkWordsValidity(boardTiles, wordList, tileBag);

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
        className={"absolute w-full h-screen bg-main overflow-hidden"}
        onMouseUp={() => setMouseHold(false)}
        onMouseMove={(event) => handleMouseMove(event)}
        style={{ top: boardPosition.yOffset, left: boardPosition.xOffset }}
      >
        <div
          className={"flex items-center justify-center"}
          onWheel={(event) => handleWheel(event)}
          style={{ transform: `scale(${zoom})` }}
        >
          <Overlay />

          <div
            onMouseDown={(event) => handleMouseDown(event)}
            style={{ position: "absolute" }}
          >
            <Board />
          </div>
        </div>

        <PlayerMenu isValid={isValid} playPointCount={playPointCount} />
      </div>
    </>
  );
};

export default Container;
