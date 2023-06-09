import type { Request, Response } from "express";
import type { Redis } from "ioredis";

export type TileType = {
  id: number;
  letter?: string;
  draggable: boolean;
  placed: boolean;
  userId: number;
};

export type PlayerData = {
  id: number;
  points: number;
  tiles: TileType[];
};

export type TileBagType = {
  [key: string]: { amount: number; value: number };
};

export type GameData = {
  uuid: string;
  board: TileType[];
  tileBag: TileBagType;
  players: PlayerData[];
  activeId: number;
  startTime: string;
};

export type ApolloContext = {
  req: Request;
  res: Response;
  redis: Redis;
};

export type LobbyData = {
  owner: number;
  createdAt: Date;
  players: { id: number }[];
};

export type LobbyPlayers = {
  players: { id: number }[];
  uuid: string;
  started: boolean;
};

export enum TOPICS {
  NEW_PLAYER_IN_LOBBY = "NEW_PLAYER_IN_LOBBY",
  TILE_UPDATED = "TILE_UPDATED",
  END_TURN = "END_TURN",
}

export type TileUpdatedPayload = {
  uuid: string;
  userId: number;
};

declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      REDIS_PORT: string;
      REDIS_HOSTNAME: string;
      DB_HOSTNAME: string;
      DB_PORT: string;
      DB_USERNAME: string;
      DB_PASSWORD: string;
      DB_NAME: string;
      COOKIE_SECRET: string;
    }
  }
}
