import { Redis } from "ioredis";
import { LobbyData } from "../types";

export async function fetchLobbyData(
  uuid: string,
  redis: Redis
): Promise<LobbyData | null> {
  const lobby = await redis.get(uuid);
  if (!lobby) {
    return null;
  }

  const lobbyData = JSON.parse(lobby) as LobbyData;

  return lobbyData;
}
