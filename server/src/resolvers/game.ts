import { randomPlayerTiles } from "../utils/randomPlayerTiles";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  PubSub,
  Publisher,
  Query,
  Resolver,
} from "type-graphql";
import { Game } from "../entities/Game";
import {
  ApolloContext,
  GameData,
  LobbyData,
  LobbyPlayers,
  TOPICS,
  TileType,
} from "../types";
import { playerIdToUser } from "../utils/playerIdToUser";

@InputType()
class MoveTileInput {
  @Field()
  uuid: string;

  @Field()
  fromId: number;

  @Field()
  toId: number;
}

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

@ObjectType()
class Tile {
  @Field()
  id: number;

  @Field()
  letter?: string;

  @Field()
  draggable: boolean;

  @Field()
  userId: number;
}

@Resolver()
export class GameResolver {
  @Mutation(() => GameResponseObject, { nullable: true })
  async newGame(
    @Arg("uuid") uuid: string,
    @Ctx() { req, redis }: ApolloContext,
    @PubSub(TOPICS.NEW_PLAYER_IN_LOBBY) publish: Publisher<LobbyPlayers>
  ): Promise<GameResponseObject | null> {
    const userId = req.session.userId;
    if (!userId) {
      return null;
    }

    const lobbyID = await redis.get(uuid);
    if (!lobbyID) {
      return null;
    }

    const lobbyData = JSON.parse(lobbyID) as LobbyData;

    const startingPlayer =
      lobbyData.players[Math.floor(Math.random() * lobbyData.players.length)];

    const playersData = lobbyData.players.map((player) => ({
      id: player.id,
      points: 0,
      tiles: randomPlayerTiles(userId), // assign random letters
    }));

    const data: GameData = {
      uuid,
      board: [],
      players: playersData,
      activeId: startingPlayer.id,
    };

    await redis.setex(`game-${uuid}`, 86400, JSON.stringify(data));

    const players = await playerIdToUser(lobbyData.players);
    await Game.create({ players }).save();

    await publish({ players: lobbyData.players, uuid, started: true });

    return {
      players: lobbyData.players,
    };
  }

  @Query(() => [Tile], { nullable: true })
  async getTiles(
    @Arg("uuid") uuid: string,
    @Ctx() { req, redis }: ApolloContext
  ): Promise<Tile[] | null> {
    const userId = req.session.userId;
    if (!userId) {
      return null;
    }

    const game = await redis.get(`game-${uuid}`);
    if (!game) {
      return null;
    }
    const gameData = JSON.parse(game) as GameData;

    let result: TileType[] = [];
    gameData.players.forEach((player) => {
      if (player.id !== userId) {
        return;
      }

      result = player.tiles;
    });

    return result;
  }

  @Mutation(() => Boolean)
  async moveTile(
    @Arg("input") input: MoveTileInput,
    @Ctx() { req, redis }: ApolloContext,
    @PubSub(TOPICS.TILE_UPDATED) _publish: Publisher<TileType>
  ): Promise<boolean> {
    const userId = req.session.userId;
    if (!userId) {
      return false;
    }

    const game = await redis.get(`game-${input.uuid}`);
    if (!game) {
      return false;
    }
    const gameData = JSON.parse(game) as GameData;

    await redis.setex(`game-${input.uuid}`, 86400, JSON.stringify(gameData));

    return true;
  }

  // @Subscription(() => [TileType], {
  //   topics: TOPICS.TILE_UPDATED,
  //   // payload
  // })
  // async tiles(@Arg("uuid") uuid: string) {

  // }

  // mutations:
  // moveTile(initPos, endPos)
  // subscriptions:
  // tiles
  // queries:
  // info (move maker, ...)
}
