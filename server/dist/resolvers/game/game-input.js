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
exports.PlayTurnInput = exports.MoveTileInput = void 0;
const type_graphql_1 = require("type-graphql");
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
exports.MoveTileInput = MoveTileInput;
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
exports.PlayTurnInput = PlayTurnInput;
//# sourceMappingURL=game-input.js.map