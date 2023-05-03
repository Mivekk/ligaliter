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
exports.LobbyReponseObject = exports.LobbyQueryResponseObject = void 0;
const User_1 = require("src/entities/User");
const type_graphql_1 = require("type-graphql");
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
exports.LobbyQueryResponseObject = LobbyQueryResponseObject;
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
exports.LobbyReponseObject = LobbyReponseObject;
//# sourceMappingURL=lobby-types.js.map