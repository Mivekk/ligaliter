"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GAME_EXPIRATION_TIME = exports.LOBBY_EXPIRATION_TIME = exports.BOARD_SIZE = exports.BOARD_LENGTH = exports.MAX_PLAYER_TILES = exports.COOKIE_NAME = exports.__prod__ = void 0;
exports.__prod__ = process.env.NODE_ENV === "production";
exports.COOKIE_NAME = "llc";
exports.MAX_PLAYER_TILES = 7;
exports.BOARD_LENGTH = 19;
exports.BOARD_SIZE = exports.BOARD_LENGTH * exports.BOARD_LENGTH;
exports.LOBBY_EXPIRATION_TIME = 3600;
exports.GAME_EXPIRATION_TIME = 86400;
//# sourceMappingURL=constants.js.map