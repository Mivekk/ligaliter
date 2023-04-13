import type { Request, Response } from "express";
import type { Redis } from "ioredis";

export type ApolloContext = {
  req: Request;
  res: Response;
  redis: Redis;
};

export type LobbyData = {
  owner: number;
  createdAt: Date;
  players: Array<{ id: number }>;
};

export type LobbyPlayers = {
  players: { id: number }[];
  uuid: string;
  started: boolean;
};

declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_HOSTNAME: string;
      DB_PORT: number;
      DB_USERNAME: string;
      DB_PASSWORD: string;
      DB_NAME: string;
      COOKIE_SECRET: string;
    }
  }
}
