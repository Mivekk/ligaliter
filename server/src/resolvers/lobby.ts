import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../entities/User";
import { ApolloContext, LobbyData } from "../types";
import { ResponseObject } from "./user";

@Resolver()
export class LobbyResolver {
  @Mutation(() => ResponseObject)
  async newLobby(
    @Arg("uuid") uuid: string,
    @Ctx() { req, redis }: ApolloContext
  ): Promise<ResponseObject> {
    const userId = req.session.userId;
    if (!userId) {
      return {
        error: {
          field: "session",
          message: "session expired",
        },
      };
    }

    const user = await User.findOneBy({ id: userId });
    if (!user) {
      return {
        error: {
          field: "user",
          message: "user doesn't exist",
        },
      };
    }

    const data: LobbyData = {
      owner: userId,
      createdAt: new Date(),
      players: [{ id: userId }],
    };

    await redis.setex(uuid, 3600, JSON.stringify(data));

    return {
      user,
    };
  }

  @Query(() => [User], { nullable: true })
  async lobbyPlayers(
    @Arg("uuid") uuid: string,
    @Ctx() { redis }: ApolloContext
  ): Promise<User[] | null> {
    const lobby = await redis.get(uuid);
    if (!lobby) {
      return null;
    }

    const lobbyData = JSON.parse(lobby) as LobbyData;

    const players = await Promise.all(
      lobbyData.players.map(
        async (item) => await User.findOneBy({ id: item.id })
      )
    );
    players.filter((item) => item !== null);

    return players as User[];
  }

  @Mutation(() => ResponseObject)
  async joinLobby(
    @Arg("uuid") uuid: string,
    @Ctx() { req, redis }: ApolloContext
  ): Promise<ResponseObject> {
    const userId = req.session.userId;
    if (!userId) {
      return {
        error: {
          field: "session",
          message: "session expired",
        },
      };
    }

    const user = await User.findOneBy({ id: userId });
    if (!user) {
      return {
        error: {
          field: "user",
          message: "user doesn't exist",
        },
      };
    }

    const lobby = await redis.get(uuid);
    if (!lobby) {
      return {
        error: {
          field: "uuid",
          message: "incorrect uuid",
        },
      };
    }

    const lobbyData = JSON.parse(lobby) as LobbyData;

    lobbyData.players.push({ id: userId });

    await redis.setex(uuid, 3600, JSON.stringify(lobbyData));

    return {
      user,
    };
  }
}
