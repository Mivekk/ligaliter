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
exports.LobbyResolver = exports.TOPICS = void 0;
const type_graphql_1 = require("type-graphql");
const User_1 = require("../entities/User");
const user_1 = require("./user");
const playerIdToUser_1 = require("../utils/playerIdToUser");
var TOPICS;
(function (TOPICS) {
    TOPICS["NEW_PLAYER_IN_LOBBY"] = "NEW_PLAYER_IN_LOBBY";
})(TOPICS = exports.TOPICS || (exports.TOPICS = {}));
let LobbyQueryResponseObject = class LobbyQueryResponseObject {
};
__decorate([
    (0, type_graphql_1.Field)(() => [User_1.User], { nullable: true }),
    __metadata("design:type", Object)
], LobbyQueryResponseObject.prototype, "players", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User, { nullable: true }),
    __metadata("design:type", Object)
], LobbyQueryResponseObject.prototype, "owner", void 0);
LobbyQueryResponseObject = __decorate([
    (0, type_graphql_1.ObjectType)()
], LobbyQueryResponseObject);
let LobbyReponseObject = class LobbyReponseObject {
};
__decorate([
    (0, type_graphql_1.Field)(() => [User_1.User], { nullable: true }),
    __metadata("design:type", Object)
], LobbyReponseObject.prototype, "players", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean),
    __metadata("design:type", Boolean)
], LobbyReponseObject.prototype, "started", void 0);
LobbyReponseObject = __decorate([
    (0, type_graphql_1.ObjectType)()
], LobbyReponseObject);
let LobbyResolver = class LobbyResolver {
    newLobby(uuid, { req, redis }) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.session.userId;
            if (!userId) {
                return {
                    error: {
                        field: "session",
                        message: "session expired",
                    },
                };
            }
            const user = yield User_1.User.findOneBy({ id: userId });
            if (!user) {
                return {
                    error: {
                        field: "user",
                        message: "user doesn't exist",
                    },
                };
            }
            const data = {
                owner: userId,
                createdAt: new Date(),
                players: [{ id: userId }],
            };
            yield redis.setex(uuid, 3600, JSON.stringify(data));
            return {
                user,
            };
        });
    }
    lobbyPlayersQuery(uuid, { redis }) {
        return __awaiter(this, void 0, void 0, function* () {
            const lobby = yield redis.get(uuid);
            if (!lobby) {
                return { players: null, owner: null };
            }
            const lobbyData = JSON.parse(lobby);
            const players = yield (0, playerIdToUser_1.playerIdToUser)(lobbyData.players);
            const owner = players.find((item) => item.id === lobbyData.owner);
            return { players, owner };
        });
    }
    lobbyPlayers(lobbyPlayersPayload, _uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            const players = yield (0, playerIdToUser_1.playerIdToUser)(lobbyPlayersPayload.players);
            return { players: players, started: lobbyPlayersPayload.started };
        });
    }
    joinLobby(uuid, { req, redis }, publish) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.session.userId;
            if (!userId) {
                return {
                    error: {
                        field: "session",
                        message: "session expired",
                    },
                };
            }
            const user = yield User_1.User.findOneBy({ id: userId });
            if (!user) {
                return {
                    error: {
                        field: "user",
                        message: "user doesn't exist",
                    },
                };
            }
            const lobby = yield redis.get(uuid);
            if (!lobby) {
                return {
                    error: {
                        field: "uuid",
                        message: "incorrect uuid",
                    },
                };
            }
            const lobbyData = JSON.parse(lobby);
            if (lobbyData.players.find((item) => item.id === user.id)) {
                return {
                    error: {
                        field: "session",
                        message: "already in lobby",
                    },
                };
            }
            lobbyData.players.push({ id: userId });
            yield redis.setex(uuid, 3600, JSON.stringify(lobbyData));
            yield publish({ players: lobbyData.players, uuid, started: false });
            return {
                user,
            };
        });
    }
    quitLobby(uuid, { redis, req }, publish) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.session.userId;
            if (!userId) {
                return {
                    error: {
                        field: "session",
                        message: "session expired",
                    },
                };
            }
            const user = yield User_1.User.findOneBy({ id: userId });
            if (!user) {
                return {
                    error: {
                        field: "user",
                        message: "user doesn't exist",
                    },
                };
            }
            const lobby = yield redis.get(uuid);
            if (!lobby) {
                return {
                    error: {
                        field: "uuid",
                        message: "incorrect uuid",
                    },
                };
            }
            const lobbyData = JSON.parse(lobby);
            lobbyData.players = lobbyData.players.filter((item) => item.id !== userId);
            if (lobbyData.players.length > 0) {
                yield redis.setex(uuid, 3600, JSON.stringify(lobbyData));
                yield publish({ players: lobbyData.players, uuid, started: false });
            }
            else {
                yield redis.del(uuid);
            }
            return {
                user,
            };
        });
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => user_1.ResponseObject),
    __param(0, (0, type_graphql_1.Arg)("uuid")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LobbyResolver.prototype, "newLobby", null);
__decorate([
    (0, type_graphql_1.Query)(() => LobbyQueryResponseObject),
    __param(0, (0, type_graphql_1.Arg)("uuid")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LobbyResolver.prototype, "lobbyPlayersQuery", null);
__decorate([
    (0, type_graphql_1.Subscription)(() => LobbyReponseObject, {
        topics: TOPICS.NEW_PLAYER_IN_LOBBY,
        filter: ({ payload, args }) => payload.uuid === args.uuid,
    }),
    __param(0, (0, type_graphql_1.Root)()),
    __param(1, (0, type_graphql_1.Arg)("uuid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LobbyResolver.prototype, "lobbyPlayers", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => user_1.ResponseObject),
    __param(0, (0, type_graphql_1.Arg)("uuid")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __param(2, (0, type_graphql_1.PubSub)(TOPICS.NEW_PLAYER_IN_LOBBY)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Function]),
    __metadata("design:returntype", Promise)
], LobbyResolver.prototype, "joinLobby", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => user_1.ResponseObject),
    __param(0, (0, type_graphql_1.Arg)("uuid")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __param(2, (0, type_graphql_1.PubSub)(TOPICS.NEW_PLAYER_IN_LOBBY)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Function]),
    __metadata("design:returntype", Promise)
], LobbyResolver.prototype, "quitLobby", null);
LobbyResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], LobbyResolver);
exports.LobbyResolver = LobbyResolver;
//# sourceMappingURL=lobby.js.map