"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomPlayerTiles = void 0;
const constants_1 = require("../constants");
const randomPlayerTiles = (userId) => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const tiles = [];
    for (let i = 0; i < constants_1.MAX_PLAYER_TILES; i++) {
        tiles.push({
            id: constants_1.BOARD_LENGTH * constants_1.BOARD_LENGTH + i,
            userId,
            draggable: true,
            placed: false,
            letter: alphabet[Math.floor(Math.random() * alphabet.length)],
        });
    }
    return tiles;
};
exports.randomPlayerTiles = randomPlayerTiles;
//# sourceMappingURL=randomPlayerTiles.js.map