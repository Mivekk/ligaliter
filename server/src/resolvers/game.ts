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
  Root,
  Subscription,
  UseMiddleware,
} from "type-graphql";
import {
  BOARD_SIZE,
  GAME_EXPIRATION_TIME,
  MAX_PLAYER_TILES,
} from "../constants";
import { Game } from "../entities/Game";
import { User } from "../entities/User";
import {
  ApolloContext,
  GameData,
  LobbyData,
  LobbyPlayers,
  TOPICS,
  TileUpdatedPayload,
} from "../types";
import { fetchGameData } from "../utils/fetchGameData";
import { initialTileBag } from "../utils/initialTileBag";
import { isAuth } from "../utils/isAuth";
import { playerIdToUser } from "../utils/playerIdToUser";
import { randomPlayerTiles } from "../utils/randomPlayerTiles";

@InputType()
class MoveTileInput {
  @Field()
  uuid: string;

  @Field()
  fromId: number;

  @Field()
  toId: number;
}

@InputType()
class PlayTurnInput {
  @Field()
  uuid: string;

  @Field()
  points: number;
}

@ObjectType()
class IdsFormat {
  @Field()
  id: number;
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
  placed: boolean;

  @Field()
  userId: number;
}

@ObjectType()
class GameResponseObject {
  @Field(() => [IdsFormat])
  players: IdsFormat[];
}

@ObjectType()
class PlayerStats {
  @Field(() => Number)
  id: number;

  @Field(() => String)
  username: string;

  @Field(() => Number)
  points: number;
}

@ObjectType()
class GameInfoResponseObject {
  @Field(() => Number)
  id: number;

  @Field(() => User)
  activePlayer: User;

  @Field(() => [PlayerStats])
  players: PlayerStats[];
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
  async getPlayerTiles(
    @Arg("uuid") uuid: string,
    @Ctx() { req, redis }: ApolloContext
  ): Promise<Tile[] | null> {
    const userId = req.session.userId!;
    const gameData = await fetchGameData(uuid, redis);
    if (!gameData) {
      return null;
    }

    const result = gameData.players.find((player) => player.id === userId)!;

    return result.tiles;
  }

  @Query(() => [Tile], { nullable: true })
  async getBoardTiles(
    @Arg("uuid") uuid: string,
    @Ctx() { redis }: ApolloContext
  ): Promise<Tile[] | null> {
    const gameData = await fetchGameData(uuid, redis);
    if (!gameData) {
      return null;
    }

    return gameData.board;
  }

  @Subscription(() => [Tile], {
    nullable: true,
    topics: [TOPICS.TILE_UPDATED, TOPICS.END_TURN],
    filter: ({ args, payload }) => args.uuid === payload.uuid,
  })
  async updateBoardTiles(
    @Arg("uuid") uuid: string,
    @Ctx() { redis }: ApolloContext
  ): Promise<Tile[] | null> {
    const gameData = await fetchGameData(uuid, redis);
    if (!gameData) {
      return null;
    }

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
    const gameData = await fetchGameData(input.uuid, redis);
    if (!gameData) {
      return false;
    }

    const playerTiles = gameData.players.find((player) => player.id === userId);

    const fromTiles =
      input.fromId >= BOARD_SIZE ? playerTiles!.tiles : gameData.board;

    const toTiles =
      input.toId >= BOARD_SIZE ? playerTiles!.tiles : gameData.board;

    const fromTile = fromTiles.find((tile) => tile.id === input.fromId)!;
    const toTile = toTiles.find((tile) => tile.id === input.toId);

    // switch tiles instead of replace
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
  async endTurn(
    @Arg("input") input: PlayTurnInput,
    @Ctx() { req, redis }: ApolloContext,
    @PubSub(TOPICS.END_TURN) publish: Publisher<TileUpdatedPayload>
  ): Promise<boolean> {
    const userId = req.session.userId!;
    const gameData = await fetchGameData(input.uuid, redis);
    if (!gameData) {
      return false;
    }

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

    gameData.board = gameData.board.filter((tile) => {
      if (input.points !== 0 || tile.placed) {
        return true;
      }

      let freeId = -1;
      for (let i = BOARD_SIZE; i < BOARD_SIZE + MAX_PLAYER_TILES; i++) {
        if (!player.tiles.find((item) => item.id === i)) {
          freeId = i;
          break;
        }
      }

      player.tiles.push({ ...tile, id: freeId });

      return false;
    });

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

  @UseMiddleware(isAuth)
  @Query(() => GameInfoResponseObject, { nullable: true })
  async getPlayerStats(
    @Arg("uuid") uuid: string,
    @Ctx() { req, redis }: ApolloContext
  ): Promise<GameInfoResponseObject | null> {
    const userId = req.session.userId!;
    const gameData = await fetchGameData(uuid, redis);
    if (!gameData) {
      return null;
    }

    const activePlayer = await User.findOneBy({ id: gameData.activeId });
    if (!activePlayer) {
      return null;
    }

    const players = (await Promise.all(
      gameData.players.map(
        async (player) => await User.findOneBy({ id: player.id })
      )
    ).then((res) => res.filter((player) => player !== null))) as User[];

    const playerStats: PlayerStats[] = players.map((player) => {
      return {
        id: player.id,
        username: player.username,
        points: gameData.players.find((item) => item.id === player.id)!.points,
      };
    });

    return {
      id: userId,
      activePlayer,
      players: playerStats,
    };
  }

  @Subscription(() => GameInfoResponseObject, {
    nullable: true,
    topics: TOPICS.END_TURN,
    filter: ({ args, payload }) => args.uuid === payload.uuid,
  })
  async updatePlayerStats(
    @Root() tileUpdatedPayload: TileUpdatedPayload,
    @Arg("uuid") uuid: string,
    @Ctx() { redis }: ApolloContext
  ): Promise<GameInfoResponseObject | null> {
    const gameData = await fetchGameData(uuid, redis);
    if (!gameData) {
      return null;
    }

    const activePlayer = await User.findOneBy({ id: gameData.activeId });
    if (!activePlayer) {
      return null;
    }

    const players = (await Promise.all(
      gameData.players.map(
        async (player) => await User.findOneBy({ id: player.id })
      )
    ).then((res) => res.filter((player) => player !== null))) as User[];

    const playerStats: PlayerStats[] = players.map((player) => {
      return {
        id: player.id,
        username: player.username,
        points: gameData.players.find((item) => item.id === player.id)!.points,
      };
    });

    return {
      id: tileUpdatedPayload.userId,
      activePlayer,
      players: playerStats,
    };
  }
}
