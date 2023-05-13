import "reflect-metadata";
import * as dotenv from "dotenv";
dotenv.config();
import { AppDataSource } from "./data-source";
import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user";
import { json } from "body-parser";
import { COOKIE_NAME, __prod__ } from "./constants";
import { Redis } from "ioredis";
import { ApolloContext } from "./types";
import RedisStore from "connect-redis";
import session from "express-session";
import cors from "cors";
import { LobbyResolver } from "./resolvers/lobby";
import { GameResolver } from "./resolvers/game";
import { createServer as createHttpServer } from "http";
import { createServer as createHttpsServer } from "https";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import fs from "fs";

const main = async () => {
  await AppDataSource.initialize();

  const app = express();
  const port = 4000;

  const expressServer = __prod__
    ? createHttpsServer(
        {
          key: fs.readFileSync(__dirname + "/../privkey.pem"),
          cert: fs.readFileSync(__dirname + "/../fullchain.pem"),
        },
        app
      )
    : createHttpServer(app);

  const wsServer = new WebSocketServer({
    server: expressServer,
    path: "/graphql",
  });

  const schema = await buildSchema({
    resolvers: [UserResolver, LobbyResolver, GameResolver],
    validate: false,
  });

  const redis = __prod__
    ? new Redis({
        port: Number(process.env.REDIS_PORT),
        host: process.env.REDIS_HOSTNAME,
      })
    : new Redis();

  const serverCleanup = useServer(
    {
      schema,
      context: async () => ({
        redis,
      }),
    },
    wsServer
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__,
      },
      secret: process.env.COOKIE_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );

  const apolloServer = new ApolloServer<ApolloContext>({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer: expressServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await apolloServer.start();
  app.use(
    "/graphql",
    cors({
      credentials: true,
      origin: ["http://localhost:3000", "https://www.ligaliter.com"],
    }),
    json(),
    expressMiddleware(apolloServer, {
      context: async ({ req, res }): Promise<ApolloContext> => ({
        req,
        res,
        redis,
      }),
    })
  );

  expressServer.listen(port, () => {
    console.log("> Started server on port", port);
  });
};

main();
