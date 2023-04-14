import { TileBagType } from "../types";

export const generateRandomLetter = (
  tileBag: TileBagType,
  setTileBag: React.Dispatch<React.SetStateAction<TileBagType>>
) => {
  const lettersArray: string[] = [];
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = 0; i < alphabet.length; i++) {
    for (let j = 0; j < tileBag[`${alphabet[i]}`].amount; j++) {
      lettersArray.push(alphabet[i]);
    }
  }

  const randomIndex = Math.floor(Math.random() * lettersArray.length);

  const newTileBag = { ...tileBag };
  newTileBag[`${lettersArray[randomIndex]}`].amount--;
  setTileBag(newTileBag);

  return lettersArray[randomIndex];
};
