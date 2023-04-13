"use strict";
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
exports.playerIdToUser = void 0;
const User_1 = require("../entities/User");
const playerIdToUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const players = yield Promise.all(data.map((item) => __awaiter(void 0, void 0, void 0, function* () { return yield User_1.User.findOneBy({ id: item.id }); }))).then((res) => res.filter((item) => item !== null));
    return players;
});
exports.playerIdToUser = playerIdToUser;
//# sourceMappingURL=playerIdToUser.js.map