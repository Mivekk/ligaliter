import "reflect-metadata";
import { AppDataSource } from "./data-source";
import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user";
import bodyParser from "body-parser";
import { COOKIE_NAME } from "./constants";
import { Redis } from "ioredis";
import { ApolloContext } from "./types";
import RedisStore from "connect-redis";
import session from "express-session";
import cors from "cors";

const main = async () => {
  await AppDataSource.initialize();

  const app = express();
  const port = 4000;

  const redis = new Redis();

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
        sameSite: "none",
        secure: true,
      },
      secret: "ugabugahehe",
      resave: false,
      saveUninitialized: false,
    })
  );

  const apolloServer = new ApolloServer<ApolloContext>({
    schema: await buildSchema({
      resolvers: [UserResolver],
      validate: false,
    }),
  });

  await apolloServer.start();
  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(apolloServer, {
      context: async ({ req, res }): Promise<ApolloContext> => ({
        req,
        res,
        redis,
      }),
    })
  );

  app.listen(port, () => {
    console.log("> Started server on port", port);
  });
};

main();
