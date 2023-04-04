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

declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}
