import { TileType } from "@/types";
import { boardCenterId, boardLength, boardSize } from "./game/constants";
import { tileBag } from "./game/tileBag";

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

  if (!sameX) {
    for (
      let i = getFirstIndex(boardTiles)!;
      i <= getLastIndex(boardTiles)!;
      i += boardLength
    ) {
      if (!boardTiles[i].letter) {
        return false;
      }
    }
  } else if (!sameY) {
    for (
      let i = getFirstIndex(boardTiles)!;
      i <= getLastIndex(boardTiles)!;
      i++
    ) {
      if (!boardTiles[i].letter) {
        return false;
      }
    }
  } else {
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

const countWordPoints = (wordList: string[], word: string): number => {
  let correctWord = wordList.find((curWord) => curWord === word);
  if (!correctWord) {
    return 0;
  }

  let points = 0;
  for (let i = 0; i < correctWord.length; i++) {
    points += tileBag[correctWord[i]].value;
  }
  return points;
};

const getHorizontalPoints = (
  startIndex: number,
  boardTiles: TileType[],
  wordList: string[]
): number => {
  let currentIndex = startIndex;
  do {
    currentIndex--;
  } while (
    currentIndex >= 0 &&
    boardTiles[currentIndex].letter &&
    currentIndex % boardLength !== boardLength - 1
  );
  currentIndex++;

  let word = "";
  do {
    word += boardTiles[currentIndex].letter;

    currentIndex++;
  } while (
    currentIndex < boardSize &&
    boardTiles[currentIndex].letter &&
    currentIndex % boardLength !== 0
  );

  return countWordPoints(wordList, word);
};

const getVerticalPoints = (
  startIndex: number,
  boardTiles: TileType[],
  wordList: string[]
): number => {
  let currentIndex = startIndex;
  do {
    currentIndex -= boardLength;
  } while (currentIndex >= 0 && boardTiles[currentIndex].letter);
  currentIndex += boardLength;

  let word = "";
  do {
    word += boardTiles[currentIndex].letter;

    currentIndex += boardLength;
  } while (currentIndex < boardSize && boardTiles[currentIndex].letter);

  return countWordPoints(wordList, word);
};

export const checkWords = (
  boardTiles: TileType[],
  wordList: string[]
): number => {
  if (!isBoardCorrect(boardTiles)) {
    return 0;
  }

  let firstIndex = getFirstIndex(boardTiles)!;
  let lastIndex = getLastIndex(boardTiles)!;

  let pointCount = 0;
  if (lastIndex >= firstIndex + boardLength) {
    pointCount += getVerticalPoints(firstIndex, boardTiles, wordList);

    for (let i = firstIndex; i <= lastIndex; i += boardLength) {
      if (!boardTiles[i].draggable) {
        continue;
      }

      pointCount += getHorizontalPoints(i, boardTiles, wordList);
    }
  } else {
    pointCount += getHorizontalPoints(firstIndex, boardTiles, wordList);

    for (let i = firstIndex; i <= lastIndex; i++) {
      if (!boardTiles[i].draggable) {
        continue;
      }

      pointCount += getVerticalPoints(i, boardTiles, wordList);
    }
  }

  return pointCount;
};
