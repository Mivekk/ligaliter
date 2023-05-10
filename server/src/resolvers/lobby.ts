import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  PubSub,
  Publisher,
  Query,
  Resolver,
  Root,
  Subscription,
} from "type-graphql";
import { LOBBY_EXPIRATION_TIME } from "../constants";
import { User } from "../entities/User";
import { ApolloContext, LobbyData, LobbyPlayers, TOPICS } from "../types";
import { fetchLobbyData } from "../utils/fetchLobbyData";
import { playerIdToUser } from "../utils/playerIdToUser";
import { ResponseObject } from "./user";

@ObjectType()
class LobbyQueryResponseObject {
  @Field(() => [User], { nullable: true })
  players: User[] | null;

  @Field(() => User, { nullable: true })
  owner: User | null;
}

@ObjectType()
class LobbyReponseObject {
  @Field(() => [User], { nullable: true })
  players: User[] | null;

  @Field(() => Boolean)
  started: boolean;
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
          message: "You must be logged in to create a lobby!",
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

    await redis.setex(uuid, LOBBY_EXPIRATION_TIME, JSON.stringify(data));

    return {
      user,
    };
  }

  @Query(() => LobbyQueryResponseObject)
  async getLobbyPlayers(
    @Arg("uuid") uuid: string,
    @Ctx() { redis }: ApolloContext
  ): Promise<LobbyQueryResponseObject> {
    const lobbyData = await fetchLobbyData(uuid, redis);
    if (!lobbyData) {
      return { players: null, owner: null };
    }

    const players = await playerIdToUser(lobbyData.players);

    const owner = players.find((item) => item.id === lobbyData.owner) as User;

    return { players, owner };
  }

  @Subscription(() => LobbyReponseObject, {
    topics: TOPICS.NEW_PLAYER_IN_LOBBY,
    filter: ({ payload, args }) => payload.uuid === args.uuid,
  })
  async updateLobbyPlayers(
    @Root() lobbyPlayersPayload: LobbyPlayers,
    @Arg("uuid") _uuid: string
  ): Promise<LobbyReponseObject> {
    const players = await playerIdToUser(lobbyPlayersPayload.players);

    return { players, started: lobbyPlayersPayload.started };
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
          message: "You must be logged in to join a lobby!",
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

    const lobbyData = await fetchLobbyData(uuid, redis);
    if (!lobbyData) {
      return {
        error: {
          field: "uuid",
          message: "incorrect uuid",
        },
      };
    }

    if (lobbyData.players.find((item) => item.id === user.id)) {
      return {
        error: {
          field: "session",
          message: "already in lobby",
        },
      };
    }

    lobbyData.players.push({ id: userId });

    await redis.setex(uuid, LOBBY_EXPIRATION_TIME, JSON.stringify(lobbyData));

    await publish({ players: lobbyData.players, uuid, started: false });

    return {
      user,
    };
  }

  @Mutation(() => ResponseObject)
  async quitLobby(
    @Arg("uuid") uuid: string,
    @Ctx() { redis, req }: ApolloContext,
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

    const lobbyData = await fetchLobbyData(uuid, redis);
    if (!lobbyData) {
      return {
        error: {
          field: "uuid",
          message: "incorrect uuid",
        },
      };
    }

    lobbyData.players = lobbyData.players.filter((item) => item.id !== userId);

    if (lobbyData.players.length > 0) {
      await redis.setex(uuid, LOBBY_EXPIRATION_TIME, JSON.stringify(lobbyData));

      await publish({ players: lobbyData.players, uuid, started: false });
    } else {
      // delete key if lobby is empty
      await redis.del(uuid);
    }

    return {
      user,
    };
  }
}
