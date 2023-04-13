import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  PubSub,
  Publisher,
  Resolver,
} from "type-graphql";
import { ApolloContext, LobbyData, LobbyPlayers } from "../types";
import { TOPICS } from "./lobby";
import { Game } from "../entities/Game";
import { playerIdToUser } from "../utils/playerIdToUser";

@ObjectType()
class PlayerIdsFormat {
  @Field()
  id: number;
}

@ObjectType()
class GameResponseObject {
  @Field(() => [PlayerIdsFormat])
  players: PlayerIdsFormat[];
}

@Resolver()
export class GameResolver {
  @Mutation(() => GameResponseObject, { nullable: true })
  async newGame(
    @Arg("uuid") uuid: string,
    @Ctx() { redis }: ApolloContext,
    @PubSub(TOPICS.NEW_PLAYER_IN_LOBBY) publish: Publisher<LobbyPlayers>
  ): Promise<GameResponseObject | null> {
    const lobbyID = await redis.get(uuid);
    if (!lobbyID) {
      return null;
    }

    const lobbyData = JSON.parse(lobbyID) as LobbyData;

    const players = await playerIdToUser(lobbyData.players);

    await Game.create({ players }).save();

    await publish({ players: lobbyData.players, uuid, started: true });

    return {
      players: lobbyData.players,
    };
  }
}
