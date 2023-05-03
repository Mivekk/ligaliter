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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameInfoResponseObject = exports.PlayerStats = exports.GameResponseObject = exports.Tile = void 0;
const User_1 = require("../../entities/User");
const type_graphql_1 = require("type-graphql");
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
exports.Tile = Tile;
let GameResponseObject = class GameResponseObject {
};
__decorate([
    (0, type_graphql_1.Field)(() => [IdsFormat]),
    __metadata("design:type", Array)
], GameResponseObject.prototype, "players", void 0);
GameResponseObject = __decorate([
    (0, type_graphql_1.ObjectType)()
], GameResponseObject);
exports.GameResponseObject = GameResponseObject;
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
exports.PlayerStats = PlayerStats;
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
exports.GameInfoResponseObject = GameInfoResponseObject;
//# sourceMappingURL=game-type.js.map