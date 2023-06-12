import { TileType } from "@/types";
import { boardCenterId, boardLength, boardSize } from "./constants";
import { tileBag } from "./tileBag";
import {
  doubleLetter,
  doubleWord,
  tripleLetter,
  tripleWord,
} from "../specialTiles";

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

const countWordPoints = (word: string, wordIndexes: number[]): number => {
  let points = 0;
  let multiplier = 1;
  for (let i = 0; i < word.length; i++) {
    let wordIndex = wordIndexes[i];

    if (doubleLetter.find((idx) => idx === wordIndex)) {
      points += tileBag[word[i]].value * 2;
    } else if (tripleLetter.find((idx) => idx === wordIndex)) {
      points += tileBag[word[i]].value * 3;
    } else if (doubleWord.find((idx) => idx === wordIndex)) {
      multiplier *= 2;
    } else if (tripleWord.find((idx) => idx === wordIndex)) {
      multiplier *= 3;
    } else {
      points += tileBag[word[i]].value;
    }
  }

  return points * multiplier;
};

const isWordCorrect = (wordList: string[], word: string): number => {
  if (word.length === 1) {
    return 0;
  }

  let correctWord = wordList.find((curWord) => curWord === word);
  if (!correctWord) {
    return -9999;
  }

  return 1;
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
  let wordIndexes: number[] = [];
  do {
    word += boardTiles[currentIndex].letter;
    wordIndexes.push(currentIndex);

    currentIndex++;
  } while (
    currentIndex < boardSize &&
    boardTiles[currentIndex].letter &&
    currentIndex % boardLength !== 0
  );

  const isCorrect = isWordCorrect(wordList, word);
  if (isCorrect <= 0) {
    return isCorrect;
  }

  return countWordPoints(word, wordIndexes);
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
  let wordIndexes: number[] = [];
  do {
    word += boardTiles[currentIndex].letter;
    wordIndexes.push(currentIndex);

    currentIndex += boardLength;
  } while (currentIndex < boardSize && boardTiles[currentIndex].letter);

  const isCorrect = isWordCorrect(wordList, word);
  if (isCorrect <= 0) {
    return isCorrect;
  }

  return countWordPoints(word, wordIndexes);
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
