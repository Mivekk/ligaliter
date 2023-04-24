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
  UseMiddleware,
} from "type-graphql";
import { BOARD_SIZE } from "../constants";
import { Game } from "../entities/Game";
import {
  ApolloContext,
  GameData,
  LobbyData,
  LobbyPlayers,
  TOPICS,
  TileType,
} from "../types";
import { isAuth } from "../utils/isAuth";
import { playerIdToUser } from "../utils/playerIdToUser";
import { randomPlayerTiles } from "../utils/randomPlayerTiles";

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

@Resolver()
export class GameResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => GameResponseObject, { nullable: true })
  async newGame(
    @Arg("uuid") uuid: string,
    @Ctx() { req, redis }: ApolloContext,
    @PubSub(TOPICS.NEW_PLAYER_IN_LOBBY) publish: Publisher<LobbyPlayers>
  ): Promise<GameResponseObject | null> {
    const userId = req.session.userId as number;

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

  @UseMiddleware(isAuth)
  @Query(() => [Tile], { nullable: true })
  async getTiles(
    @Arg("uuid") uuid: string,
    @Ctx() { req, redis }: ApolloContext
  ): Promise<Tile[] | null> {
    const userId = req.session.userId as number;

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

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async moveTile(
    @Arg("input", () => MoveTileInput) input: MoveTileInput,
    @Ctx() { req, redis }: ApolloContext,
    @PubSub(TOPICS.TILE_UPDATED) _publish: Publisher<TileType>
  ): Promise<boolean> {
    const userId = req.session.userId as number;

    const game = await redis.get(`game-${input.uuid}`);
    if (!game) {
      return false;
    }
    const gameData = JSON.parse(game) as GameData;
    const playerTiles = gameData.players.find((player) => player.id === userId);

    const fromTiles =
      input.fromId >= BOARD_SIZE ? playerTiles!.tiles : gameData.board;

    const toTiles =
      input.toId >= BOARD_SIZE ? playerTiles!.tiles : gameData.board;

    const fromTile = fromTiles.find((tile) => tile.id === input.fromId)!;
    const toTile = toTiles.find((tile) => tile.id === input.toId)!;

    console.log("From tile", fromTile, " To tile: ", toTile);

    // switch instead of replace
    if (toTile) {
      [fromTile.letter, toTile.letter] = [toTile.letter, fromTile.letter];
    } else {
      toTiles.push(fromTile);

      fromTile.id = input.toId;

      fromTiles.splice(
        fromTiles.findIndex((tile) => tile === fromTile),
        1
      );
    }

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
