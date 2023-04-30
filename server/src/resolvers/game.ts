import { initialTileBag } from "../utils/initialTileBag";
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
  Subscription,
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
  TileUpdatedPayload,
} from "../types";
import { isAuth } from "../utils/isAuth";
import { playerIdToUser } from "../utils/playerIdToUser";
import { randomPlayerTiles } from "../utils/randomPlayerTiles";
import { GAME_EXPIRATION_TIME } from "../constants";
import { User } from "../entities/User";

@ObjectType()
class Tile {
  @Field()
  id: number;

  @Field()
  letter?: string;

  @Field()
  draggable: boolean;

  @Field()
  placed: boolean;

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

@InputType()
class PlayTurnInput {
  @Field()
  uuid: string;

  @Field()
  points: number;
}

@ObjectType()
class MakingTurnResponseObject {
  @Field()
  id: number;

  @Field()
  activePlayer: string;
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

    const startingPlayer =
      lobbyData.players[Math.floor(Math.random() * lobbyData.players.length)];

    const playersData = lobbyData.players.map((player) => ({
      id: player.id,
      points: 0,
      tiles: randomPlayerTiles(player.id), // assign random letters
    }));

    const data: GameData = {
      uuid,
      board: [],
      tileBag: initialTileBag,
      players: playersData,
      activeId: startingPlayer.id,
    };

    await redis.setex(
      `game-${uuid}`,
      GAME_EXPIRATION_TIME,
      JSON.stringify(data)
    );

    const players = await playerIdToUser(lobbyData.players);
    await Game.create({ players }).save();

    await publish({ players: lobbyData.players, uuid, started: true });

    return {
      players: lobbyData.players,
    };
  }

  @UseMiddleware(isAuth)
  @Query(() => [Tile], { nullable: true })
  async getTilesQuery(
    @Arg("uuid") uuid: string,
    @Ctx() { req, redis }: ApolloContext
  ): Promise<Tile[] | null> {
    const userId = req.session.userId!;

    const game = await redis.get(`game-${uuid}`);
    if (!game) {
      return null;
    }

    const gameData = JSON.parse(game) as GameData;

    const result = gameData.players.find((player) => player.id === userId)!;

    return result.tiles;
  }

  @Subscription(() => [Tile], {
    nullable: true,
    topics: TOPICS.TILE_UPDATED,
    filter: ({ args, payload }) => args.uuid === payload.uuid,
  })
  async getBoardTiles(
    @Ctx() { redis }: ApolloContext,
    @Arg("uuid") uuid: string
  ): Promise<Tile[] | null> {
    const game = await redis.get(`game-${uuid}`);
    if (!game) {
      return null;
    }

    const gameData = JSON.parse(game) as GameData;

    return gameData.board;
  }

  @Query(() => [Tile], { nullable: true })
  async getBoardTilesQuery(
    @Ctx() { redis }: ApolloContext,
    @Arg("uuid") uuid: string
  ): Promise<Tile[] | null> {
    const game = await redis.get(`game-${uuid}`);
    if (!game) {
      return null;
    }

    const gameData = JSON.parse(game) as GameData;

    return gameData.board;
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async moveTile(
    @Arg("input", () => MoveTileInput) input: MoveTileInput,
    @Ctx() { req, redis }: ApolloContext,
    @PubSub(TOPICS.TILE_UPDATED) publish: Publisher<TileUpdatedPayload>
  ): Promise<boolean> {
    const userId = req.session.userId!;

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
    const toTile = toTiles.find((tile) => tile.id === input.toId);

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

    await redis.setex(
      `game-${input.uuid}`,
      GAME_EXPIRATION_TIME,
      JSON.stringify(gameData)
    );

    await publish({ uuid: input.uuid, userId });

    return true;
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async playTurn(
    @Arg("input") input: PlayTurnInput,
    @Ctx() { req, redis }: ApolloContext,
    @PubSub(TOPICS.TILE_UPDATED) publish: Publisher<TileUpdatedPayload>
  ): Promise<boolean> {
    const userId = req.session.userId!;

    const game = await redis.get(`game-${input.uuid}`);
    if (!game) {
      return false;
    }

    const gameData = JSON.parse(game) as GameData;
    const player = gameData.players.find((player) => player.id === userId);
    if (!player) {
      return false;
    }

    player.points += input.points;

    gameData.activeId =
      gameData.players[
        (gameData.players.findIndex((el) => el.id === gameData.activeId) + 1) %
          gameData.players.length
      ].id;

    gameData.board.forEach((tile) => {
      tile.draggable = false;
      tile.placed = true;
    });

    await redis.setex(
      `game-${input.uuid}`,
      GAME_EXPIRATION_TIME,
      JSON.stringify(gameData)
    );

    await publish({ uuid: input.uuid, userId });

    return true;
  }

  @Query(() => MakingTurnResponseObject, { nullable: true })
  async makingTurn(
    @Arg("uuid") uuid: string,
    @Ctx() { redis }: ApolloContext
  ): Promise<MakingTurnResponseObject | null> {
    const game = await redis.get(`game-${uuid}`);
    if (!game) {
      return null;
    }

    const gameData = JSON.parse(game) as GameData;

    const user = (await User.findOneBy({ id: gameData.activeId })) as User;

    return {
      id: gameData.activeId,
      activePlayer: user.username,
    };
  }
}
