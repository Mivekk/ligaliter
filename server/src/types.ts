import type { Request, Response } from "express";
import type { Redis } from "ioredis";

export type ApolloContext = {
  req: Request;
  res: Response;
  redis: Redis;
};

declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}
