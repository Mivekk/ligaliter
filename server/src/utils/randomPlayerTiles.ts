import { BOARD_LENGTH, MAX_PLAYER_TILES } from "../constants";
import { TileType } from "../types";

export const randomPlayerTiles = (userId: number): TileType[] => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const tiles: TileType[] = [];
  for (let i = 0; i < MAX_PLAYER_TILES; i++) {
    tiles.push({
      id: BOARD_LENGTH * BOARD_LENGTH + i,
      userId,
      draggable: true,
      letter: alphabet[Math.floor(Math.random() * alphabet.length)],
    });
  }

  return tiles;
};
