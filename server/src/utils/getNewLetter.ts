import { TileBagType } from "src/types";

export const getNewLetter = (
  tileBag: TileBagType,
  swap: boolean
): string | undefined => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const allTiles: string[] = [];
  for (let i = 0; i < letters.length; i++) {
    for (let j = 0; j < tileBag[letters[i]].amount; j++) {
      allTiles.push(letters[i]);
    }
  }

  if (!allTiles.length) {
    return undefined;
  }

  const letter = allTiles[Math.floor(Math.random() * allTiles.length)];
  if (!swap) {
    tileBag[letter].amount--;
  }

  return letter;
};
