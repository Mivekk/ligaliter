import { TileBagType, TileType } from "@/types";
import { boardCenterId, boardLength, boardSize } from "./game/constants";

const isAdjacentToPlaced = (boardTiles: TileType[]): boolean => {
  let isAdjacent = false;
  let touchesCenter = false;
  for (let i = 0; i < boardSize && !isAdjacent; i++) {
    if (!boardTiles[i].draggable) {
      continue;
    }

    if (i === boardCenterId) {
      touchesCenter = true;
      break;
    }

    const adjacentIndexes: number[] = [-1, 1, -boardLength, boardLength];
    for (let j = 0; j < adjacentIndexes.length; j++) {
      const nextIndex = i + adjacentIndexes[j];
      if (nextIndex < 0 || nextIndex >= boardSize) {
        continue;
      }

      if (boardTiles[nextIndex].placed) {
        isAdjacent = true;
        break;
      }
    }
  }

  return isAdjacent || touchesCenter;
};

const isBoardCorrect = (boardTiles: TileType[]): boolean => {
  const draggableIndexes: { x: number; y: number }[] = [];
  boardTiles.forEach((tile) => {
    if (tile.draggable) {
      draggableIndexes.push({
        x: tile.id % boardLength,
        y: Math.floor(tile.id / boardLength),
      });
    }
  });

  if (!draggableIndexes.length) {
    return false;
  }

  let sameX = draggableIndexes.find(
    (index) => index.x !== draggableIndexes[0].x
  );

  let sameY = draggableIndexes.find(
    (index) => index.y !== draggableIndexes[0].y
  );

  if (sameX && sameY) {
    return false;
  }

  if (!isAdjacentToPlaced(boardTiles)) {
    return false;
  }

  return true;
};

const getFirstIndex = (boardTiles: TileType[]): number | undefined => {
  for (let i = 0; i < boardSize; i++) {
    if (boardTiles[i].draggable) {
      return i;
    }
  }
};

const getLastIndex = (boardTiles: TileType[]): number | undefined => {
  for (let i = boardSize - 1; i >= 0; i--) {
    if (boardTiles[i].draggable) {
      return i;
    }
  }
};

const getHorizontalPoints = (
  boardTiles: TileType[],
  wordList: string[],
  tileBag: TileBagType
): number => {
  return 0;
};

const getVerticalPoints = (
  boardTiles: TileType[],
  wordList: string[],
  tileBag: TileBagType
): number => {
  return 0;
};

export const checkWords = (
  boardTiles: TileType[],
  wordList: string[],
  tileBag: TileBagType
): number => {
  if (!isBoardCorrect(boardTiles)) {
    return 0;
  }

  let firstIndex = getFirstIndex(boardTiles)!;
  let lastIndex = getLastIndex(boardTiles)!;

  console.log(firstIndex, lastIndex);

  let pointCount = 0;
  if (lastIndex >= firstIndex + boardLength) {
    getVerticalPoints(boardTiles, wordList, tileBag);

    for (let i = firstIndex; i <= lastIndex; i += boardLength) {
      if (!boardTiles[i].draggable) {
        continue;
      }

      pointCount += getHorizontalPoints(boardTiles, wordList, tileBag);
    }
  } else {
    getHorizontalPoints(boardTiles, wordList, tileBag);

    for (let i = firstIndex; i <= lastIndex; i++) {
      if (!boardTiles[i].draggable) {
        continue;
      }

      pointCount += getVerticalPoints(boardTiles, wordList, tileBag);
    }
  }

  return pointCount;
};
