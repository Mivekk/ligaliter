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
const types_1 = require("../types");
const isAuth_1 = require("../utils/isAuth");
const playerIdToUser_1 = require("../utils/playerIdToUser");
const randomPlayerTiles_1 = require("../utils/randomPlayerTiles");
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
    __metadata("design:type", Number)
], Tile.prototype, "userId", void 0);
Tile = __decorate([
    (0, type_graphql_1.ObjectType)()
], Tile);
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
let PlayerIdsFormat = class PlayerIdsFormat {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], PlayerIdsFormat.prototype, "id", void 0);
PlayerIdsFormat = __decorate([
    (0, type_graphql_1.ObjectType)()
], PlayerIdsFormat);
let GameResponseObject = class GameResponseObject {
};
__decorate([
    (0, type_graphql_1.Field)(() => [PlayerIdsFormat]),
    __metadata("design:type", Array)
], GameResponseObject.prototype, "players", void 0);
GameResponseObject = __decorate([
    (0, type_graphql_1.ObjectType)()
], GameResponseObject);
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
                players: playersData,
                activeId: startingPlayer.id,
            };
            yield redis.setex(`game-${uuid}`, 86400, JSON.stringify(data));
            const players = yield (0, playerIdToUser_1.playerIdToUser)(lobbyData.players);
            yield Game_1.Game.create({ players }).save();
            yield publish({ players: lobbyData.players, uuid, started: true });
            return {
                players: lobbyData.players,
            };
        });
    }
    getTilesQuery(uuid, { req, redis }) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.session.userId;
            const game = yield redis.get(`game-${uuid}`);
            if (!game) {
                return null;
            }
            const gameData = JSON.parse(game);
            const result = gameData.players.find((player) => player.id === userId);
            return result.tiles;
        });
    }
    getTiles(uuid, tileUpdatedPayload, { redis }) {
        return __awaiter(this, void 0, void 0, function* () {
            const game = yield redis.get(`game-${uuid}`);
            if (!game) {
                return null;
            }
            const gameData = JSON.parse(game);
            const result = gameData.players.find((player) => player.id === tileUpdatedPayload.userId);
            return result.tiles;
        });
    }
    getBoardTiles({ redis }, uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            const game = yield redis.get(`game-${uuid}`);
            if (!game) {
                return null;
            }
            const gameData = JSON.parse(game);
            return gameData.board;
        });
    }
    getBoardTilesQuery({ redis }, uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            const game = yield redis.get(`game-${uuid}`);
            if (!game) {
                return null;
            }
            const gameData = JSON.parse(game);
            return gameData.board;
        });
    }
    moveTile(input, { req, redis }, publish) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.session.userId;
            const game = yield redis.get(`game-${input.uuid}`);
            if (!game) {
                return false;
            }
            const gameData = JSON.parse(game);
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
            yield publish({ uuid: input.uuid, userId });
            yield redis.setex(`game-${input.uuid}`, 86400, JSON.stringify(gameData));
            return true;
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
], GameResolver.prototype, "getTilesQuery", null);
__decorate([
    (0, type_graphql_1.Subscription)(() => [Tile], {
        nullable: true,
        topics: types_1.TOPICS.TILE_UPDATED,
        filter: ({ args, payload, context }) => {
            if (payload.uuid === args.uuid &&
                payload.userId === context.req.session.userId) {
                return true;
            }
            return false;
        },
    }),
    __param(0, (0, type_graphql_1.Arg)("uuid")),
    __param(1, (0, type_graphql_1.Root)()),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], GameResolver.prototype, "getTiles", null);
__decorate([
    (0, type_graphql_1.Subscription)(() => [Tile], {
        nullable: true,
        topics: types_1.TOPICS.TILE_UPDATED,
        filter: ({ args, payload }) => args.uuid === payload.uuid,
    }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("uuid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], GameResolver.prototype, "getBoardTiles", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Tile], { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("uuid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], GameResolver.prototype, "getBoardTilesQuery", null);
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
GameResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], GameResolver);
exports.GameResolver = GameResolver;
//# sourceMappingURL=game.js.map