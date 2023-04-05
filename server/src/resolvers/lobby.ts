import { User } from "../entities/User";
import { ApolloContext, LobbyData } from "../types";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";

@ObjectType()
class LobbyFieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class LobbyResponseObject {
  @Field(() => LobbyFieldError, { nullable: true })
  error?: LobbyFieldError;

  @Field(() => Boolean)
  success: boolean;
}

@Resolver()
export class LobbyResolver {
  @Mutation(() => LobbyResponseObject)
  async newLobby(
    @Arg("uuid") uuid: string,
    @Ctx() { req, redis }: ApolloContext
  ): Promise<LobbyResponseObject> {
    const ownerId = req.session.userId;
    if (!ownerId) {
      return {
        success: false,
        error: {
          field: "cookie",
          message: "not logged in",
        },
      };
    }

    const owner = await User.findOneBy({ id: ownerId });
    if (!owner) {
      return {
        success: false,
        error: {
          field: "user",
          message: "user doesn't exist",
        },
      };
    }

    const data: LobbyData = {
      owner: ownerId,
      createdAt: new Date(),
      players: [{ id: ownerId }],
    };

    await redis.setex(uuid, 3600, JSON.stringify(data));

    return {
      success: true,
    };
  }

  @Query(() => [User])
  async lobbyPlayers(
    @Arg("uuid") uuid: string,
    @Ctx() { redis }: ApolloContext
  ): Promise<Array<User | null>> {
    const lobbyData = await redis.get(uuid);
    console.log("yooo", uuid, lobbyData);
    if (!lobbyData) {
      return [];
    }

    const playersData = JSON.parse(lobbyData) as LobbyData;

    const players = await Promise.all(
      playersData.players.map(
        async (item) => await User.findOneBy({ id: item.id })
      )
    );

    return players;
  }

  @Mutation(() => LobbyResponseObject)
  async joinLobby(
    @Arg("uuid") uuid: string,
    @Ctx() { req, redis }: ApolloContext
  ): Promise<LobbyResponseObject> {
    const userId = req.session.userId;
    if (!userId) {
      return {
        success: false,
        error: {
          field: "cookie",
          message: "not logged in",
        },
      };
    }

    const lobbyData = await redis.get(uuid);
    if (!lobbyData) {
      return {
        success: false,
        error: {
          field: "uuid",
          message: "incorrect uuid",
        },
      };
    }

    const playersData = JSON.parse(lobbyData) as LobbyData;

    playersData.players.push({ id: userId });

    await redis.setex(uuid, 3600, JSON.stringify(playersData));

    return {
      success: true,
    };
  }
}
