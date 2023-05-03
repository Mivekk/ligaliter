import { Redis } from "ioredis";
import { GameData } from "../types";

export async function fetchGameData(
  uuid: string,
  redis: Redis
): Promise<GameData | null> {
  const game = await redis.get(`game-${uuid}`);
  if (!game) {
    return null;
  }

  const gameData = JSON.parse(game) as GameData;

  return gameData;
}
