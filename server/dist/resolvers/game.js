"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameResolver = void 0;
const type_graphql_1 = require("type-graphql");
const constants_1 = require("../constants");
const Game_1 = require("../entities/Game");
const User_1 = require("../entities/User");
const types_1 = require("../types");
const fetchGameData_1 = require("../utils/fetchGameData");
const initialTileBag_1 = require("../utils/initialTileBag");
const isAuth_1 = require("../utils/isAuth");
const playerIdToUser_1 = require("../utils/playerIdToUser");
const randomPlayerTiles_1 = require("../utils/randomPlayerTiles");
let MoveTileInput = class MoveTileInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], MoveTileInput.prototype, "uuid", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], MoveTileInput.prototype, "fromId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], MoveTileInput.prototype, "toId", void 0);
MoveTileInput = __decorate([
    (0, type_graphql_1.InputType)()
], MoveTileInput);
let PlayTurnInput = class PlayTurnInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], PlayTurnInput.prototype, "uuid", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], PlayTurnInput.prototype, "points", void 0);
PlayTurnInput = __decorate([
    (0, type_graphql_1.InputType)()
], PlayTurnInput);
let IdsFormat = class IdsFormat {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], IdsFormat.prototype, "id", void 0);
IdsFormat = __decorate([
    (0, type_graphql_1.ObjectType)()
], IdsFormat);
let Tile = class Tile {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], Tile.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], Tile.prototype, "letter", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], Tile.prototype, "draggable", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], Tile.prototype, "placed", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], Tile.prototype, "userId", void 0);
Tile = __decorate([
    (0, type_graphql_1.ObjectType)()
], Tile);
let GameResponseObject = class GameResponseObject {
};
__decorate([
    (0, type_graphql_1.Field)(() => [IdsFormat]),
    __metadata("design:type", Array)
], GameResponseObject.prototype, "players", void 0);
GameResponseObject = __decorate([
    (0, type_graphql_1.ObjectType)()
], GameResponseObject);
let PlayerStats = class PlayerStats {
};
__decorate([
    (0, type_graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], PlayerStats.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], PlayerStats.prototype, "username", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], PlayerStats.prototype, "points", void 0);
PlayerStats = __decorate([
    (0, type_graphql_1.ObjectType)()
], PlayerStats);
let GameInfoResponseObject = class GameInfoResponseObject {
};
__decorate([
    (0, type_graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], GameInfoResponseObject.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User),
    __metadata("design:type", User_1.User)
], GameInfoResponseObject.prototype, "activePlayer", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [PlayerStats]),
    __metadata("design:type", Array)
], GameInfoResponseObject.prototype, "players", void 0);
GameInfoResponseObject = __decorate([
    (0, type_graphql_1.ObjectType)()
], GameInfoResponseObject);
let GameResolver = class GameResolver {
    newGame(uuid, { redis }, publish) {
        return __awaiter(this, void 0, void 0, function* () {
            const lobbyID = yield redis.get(uuid);
            if (!lobbyID) {
                return null;
            }
            const lobbyData = JSON.parse(lobbyID);
            const startingPlayer = lobbyData.players[Math.floor(Math.random() * lobbyData.players.length)];
            const playersData = lobbyData.players.map((player) => ({
                id: player.id,
                points: 0,
                tiles: (0, randomPlayerTiles_1.randomPlayerTiles)(player.id),
            }));
            const data = {
                uuid,
                board: [],
                tileBag: initialTileBag_1.initialTileBag,
                players: playersData,
                activeId: startingPlayer.id,
            };
            yield redis.setex(`game-${uuid}`, constants_1.GAME_EXPIRATION_TIME, JSON.stringify(data));
            const players = yield (0, playerIdToUser_1.playerIdToUser)(lobbyData.players);
            yield Game_1.Game.create({ players }).save();
            yield publish({ players: lobbyData.players, uuid, started: true });
            return {
                players: lobbyData.players,
            };
        });
    }
    getPlayerTiles(uuid, { req, redis }) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.session.userId;
            const gameData = yield (0, fetchGameData_1.fetchGameData)(uuid, redis);
            if (!gameData) {
                return null;
            }
            const result = gameData.players.find((player) => player.id === userId);
            return result.tiles;
        });
    }
    updatePlayerTiles(uuid, { req, redis }) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.session.userId;
            const gameData = yield (0, fetchGameData_1.fetchGameData)(uuid, redis);
            if (!gameData) {
                return null;
            }
            const result = gameData.players.find((player) => player.id === userId);
            return result.tiles;
        });
    }
    getBoardTiles(uuid, { redis }) {
        return __awaiter(this, void 0, void 0, function* () {
            const gameData = yield (0, fetchGameData_1.fetchGameData)(uuid, redis);
            if (!gameData) {
                return null;
            }
            return gameData.board;
        });
    }
    updateBoardTiles(uuid, { redis }) {
        return __awaiter(this, void 0, void 0, function* () {
            const gameData = yield (0, fetchGameData_1.fetchGameData)(uuid, redis);
            if (!gameData) {
                return null;
            }
            return gameData.board;
        });
    }
    moveTile(input, { req, redis }, publish) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.session.userId;
            const gameData = yield (0, fetchGameData_1.fetchGameData)(input.uuid, redis);
            if (!gameData) {
                return false;
            }
            const playerTiles = gameData.players.find((player) => player.id === userId);
            const fromTiles = input.fromId >= constants_1.BOARD_SIZE ? playerTiles.tiles : gameData.board;
            const toTiles = input.toId >= constants_1.BOARD_SIZE ? playerTiles.tiles : gameData.board;
            const fromTile = fromTiles.find((tile) => tile.id === input.fromId);
            const toTile = toTiles.find((tile) => tile.id === input.toId);
            if (toTile) {
                [fromTile.letter, toTile.letter] = [toTile.letter, fromTile.letter];
            }
            else {
                toTiles.push(fromTile);
                fromTile.id = input.toId;
                fromTiles.splice(fromTiles.findIndex((tile) => tile === fromTile), 1);
            }
            yield redis.setex(`game-${input.uuid}`, constants_1.GAME_EXPIRATION_TIME, JSON.stringify(gameData));
            yield publish({ uuid: input.uuid, userId });
            return true;
        });
    }
    playTurn(input, { req, redis }, publish) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.session.userId;
            const gameData = yield (0, fetchGameData_1.fetchGameData)(input.uuid, redis);
            if (!gameData) {
                return false;
            }
            const player = gameData.players.find((player) => player.id === userId);
            if (!player) {
                return false;
            }
            player.points += input.points;
            gameData.activeId =
                gameData.players[(gameData.players.findIndex((el) => el.id === gameData.activeId) + 1) %
                    gameData.players.length].id;
            gameData.board.forEach((tile) => {
                tile.draggable = false;
                tile.placed = true;
            });
            yield redis.setex(`game-${input.uuid}`, constants_1.GAME_EXPIRATION_TIME, JSON.stringify(gameData));
            yield publish({ uuid: input.uuid, userId });
            return true;
        });
    }
    getPlayerStats(uuid, { req, redis }) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.session.userId;
            const gameData = yield (0, fetchGameData_1.fetchGameData)(uuid, redis);
            if (!gameData) {
                return null;
            }
            const activePlayer = yield User_1.User.findOneBy({ id: gameData.activeId });
            if (!activePlayer) {
                return null;
            }
            const players = (yield Promise.all(gameData.players.map((player) => __awaiter(this, void 0, void 0, function* () { return yield User_1.User.findOneBy({ id: player.id }); }))).then((res) => res.filter((player) => player !== null)));
            const playerStats = players.map((player) => {
                return {
                    id: player.id,
                    username: player.username,
                    points: gameData.players.find((item) => item.id === player.id).points,
                };
            });
            return {
                id: userId,
                activePlayer,
                players: playerStats,
            };
        });
    }
    updatePlayerStats(tileUpdatedPayload, uuid, { redis }) {
        return __awaiter(this, void 0, void 0, function* () {
            const gameData = yield (0, fetchGameData_1.fetchGameData)(uuid, redis);
            if (!gameData) {
                return null;
            }
            const activePlayer = yield User_1.User.findOneBy({ id: gameData.activeId });
            if (!activePlayer) {
                return null;
            }
            const players = (yield Promise.all(gameData.players.map((player) => __awaiter(this, void 0, void 0, function* () { return yield User_1.User.findOneBy({ id: player.id }); }))).then((res) => res.filter((player) => player !== null)));
            const playerStats = players.map((player) => {
                return {
                    id: player.id,
                    username: player.username,
                    points: gameData.players.find((item) => item.id === player.id).points,
                };
            });
            return {
                id: tileUpdatedPayload.userId,
                activePlayer,
                players: playerStats,
            };
        });
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => GameResponseObject, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("uuid")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __param(2, (0, type_graphql_1.PubSub)(types_1.TOPICS.NEW_PLAYER_IN_LOBBY)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Function]),
    __metadata("design:returntype", Promise)
], GameResolver.prototype, "newGame", null);
__decorate([
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    (0, type_graphql_1.Query)(() => [Tile], { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("uuid")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GameResolver.prototype, "getPlayerTiles", null);
__decorate([
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    (0, type_graphql_1.Subscription)(() => [Tile], {
        nullable: true,
        topics: types_1.TOPICS.END_TURN,
        filter: ({ args, payload }) => args.uuid == payload.uuid,
    }),
    __param(0, (0, type_graphql_1.Arg)("uuid")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GameResolver.prototype, "updatePlayerTiles", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Tile], { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("uuid")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GameResolver.prototype, "getBoardTiles", null);
__decorate([
    (0, type_graphql_1.Subscription)(() => [Tile], {
        nullable: true,
        topics: types_1.TOPICS.TILE_UPDATED,
        filter: ({ args, payload }) => args.uuid === payload.uuid,
    }),
    __param(0, (0, type_graphql_1.Arg)("uuid")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GameResolver.prototype, "updateBoardTiles", null);
__decorate([
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("input", () => MoveTileInput)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __param(2, (0, type_graphql_1.PubSub)(types_1.TOPICS.TILE_UPDATED)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MoveTileInput, Object, Function]),
    __metadata("design:returntype", Promise)
], GameResolver.prototype, "moveTile", null);
__decorate([
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __param(2, (0, type_graphql_1.PubSub)(types_1.TOPICS.TILE_UPDATED)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayTurnInput, Object, Function]),
    __metadata("design:returntype", Promise)
], GameResolver.prototype, "playTurn", null);
__decorate([
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    (0, type_graphql_1.Query)(() => GameInfoResponseObject, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("uuid")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GameResolver.prototype, "getPlayerStats", null);
__decorate([
    (0, type_graphql_1.Subscription)(() => GameInfoResponseObject, {
        nullable: true,
        topics: types_1.TOPICS.TILE_UPDATED,
        filter: ({ args, payload }) => args.uuid === payload.uuid,
    }),
    __param(0, (0, type_graphql_1.Root)()),
    __param(1, (0, type_graphql_1.Arg)("uuid")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], GameResolver.prototype, "updatePlayerStats", null);
GameResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], GameResolver);
exports.GameResolver = GameResolver;
//# sourceMappingURL=game.js.map