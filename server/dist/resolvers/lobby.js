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
exports.LobbyResolver = void 0;
const User_1 = require("../entities/User");
const type_graphql_1 = require("type-graphql");
let LobbyFieldError = class LobbyFieldError {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], LobbyFieldError.prototype, "field", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], LobbyFieldError.prototype, "message", void 0);
LobbyFieldError = __decorate([
    (0, type_graphql_1.ObjectType)()
], LobbyFieldError);
let LobbyResponseObject = class LobbyResponseObject {
};
__decorate([
    (0, type_graphql_1.Field)(() => LobbyFieldError, { nullable: true }),
    __metadata("design:type", LobbyFieldError)
], LobbyResponseObject.prototype, "error", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean),
    __metadata("design:type", Boolean)
], LobbyResponseObject.prototype, "success", void 0);
LobbyResponseObject = __decorate([
    (0, type_graphql_1.ObjectType)()
], LobbyResponseObject);
let LobbyResolver = class LobbyResolver {
    newLobby(uuid, { req, redis }) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const owner = yield User_1.User.findOneBy({ id: ownerId });
            if (!owner) {
                return {
                    success: false,
                    error: {
                        field: "user",
                        message: "user doesn't exist",
                    },
                };
            }
            const data = {
                owner: ownerId,
                createdAt: new Date(),
                players: [{ id: ownerId }],
            };
            yield redis.setex(uuid, 3600, JSON.stringify(data));
            return {
                success: true,
            };
        });
    }
    lobbyPlayers(uuid, { redis }) {
        return __awaiter(this, void 0, void 0, function* () {
            const lobbyData = yield redis.get(uuid);
            console.log("yooo", uuid, lobbyData);
            if (!lobbyData) {
                return [];
            }
            const playersData = JSON.parse(lobbyData);
            const players = yield Promise.all(playersData.players.map((item) => __awaiter(this, void 0, void 0, function* () { return yield User_1.User.findOneBy({ id: item.id }); })));
            return players;
        });
    }
    joinLobby(uuid, { req, redis }) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const lobbyData = yield redis.get(uuid);
            if (!lobbyData) {
                return {
                    success: false,
                    error: {
                        field: "uuid",
                        message: "incorrect uuid",
                    },
                };
            }
            const playersData = JSON.parse(lobbyData);
            playersData.players.push({ id: userId });
            yield redis.setex(uuid, 3600, JSON.stringify(playersData));
            return {
                success: true,
            };
        });
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => LobbyResponseObject),
    __param(0, (0, type_graphql_1.Arg)("uuid")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LobbyResolver.prototype, "newLobby", null);
__decorate([
    (0, type_graphql_1.Query)(() => [User_1.User]),
    __param(0, (0, type_graphql_1.Arg)("uuid")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LobbyResolver.prototype, "lobbyPlayers", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => LobbyResponseObject),
    __param(0, (0, type_graphql_1.Arg)("uuid")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LobbyResolver.prototype, "joinLobby", null);
LobbyResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], LobbyResolver);
exports.LobbyResolver = LobbyResolver;
//# sourceMappingURL=lobby.js.map