import {
  Arg,
  Ctx,
  Mutation,
  PubSub,
  Publisher,
  Query,
  Resolver,
  Root,
  Subscription,
} from "type-graphql";
import { User } from "../entities/User";
import { ApolloContext, LobbyData, LobbyPlayers } from "../types";
import { ResponseObject } from "./user";

enum TOPICS {
  NEW_PLAYER_IN_LOBBY = "NEW_PLAYER_IN_LOBBY",
}

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
  async lobbyPlayersQuery(
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
    ).then((res) => res.filter((item) => item !== null));

    return players as User[];
  }

  @Subscription(() => [User], {
    nullable: true,
    topics: TOPICS.NEW_PLAYER_IN_LOBBY,
    filter: ({ payload, args }) => payload.uuid === args.uuid,
  })
  async lobbyPlayers(
    @Root() lobbyPlayersPayload: LobbyPlayers,
    @Arg("uuid") _uuid: string
  ): Promise<User[] | null> {
    const players = await Promise.all(
      lobbyPlayersPayload.players.map(
        async (item) => await User.findOneBy({ id: item.id })
      )
    ).then((res) => res.filter((item) => item !== null));

    return players as User[];
  }

  @Mutation(() => ResponseObject)
  async joinLobby(
    @Arg("uuid") uuid: string,
    @Ctx() { req, redis }: ApolloContext,
    @PubSub(TOPICS.NEW_PLAYER_IN_LOBBY) publish: Publisher<LobbyPlayers>
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

    await publish({ players: lobbyData.players, uuid });

    return {
      user,
    };
  }
}
