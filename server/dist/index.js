"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const data_source_1 = require("./data-source");
const express_1 = __importDefault(require("express"));
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const type_graphql_1 = require("type-graphql");
const user_1 = require("./resolvers/user");
const body_parser_1 = require("body-parser");
const constants_1 = require("./constants");
const ioredis_1 = require("ioredis");
const connect_redis_1 = __importDefault(require("connect-redis"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const lobby_1 = require("./resolvers/lobby");
const game_1 = require("./resolvers/game");
const http_1 = require("http");
const ws_1 = require("ws");
const ws_2 = require("graphql-ws/lib/use/ws");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield data_source_1.AppDataSource.initialize();
    const app = (0, express_1.default)();
    const port = 4000;
    const httpServer = (0, http_1.createServer)(app);
    const wsServer = new ws_1.WebSocketServer({
        server: httpServer,
        path: "/graphql",
    });
    const schema = yield (0, type_graphql_1.buildSchema)({
        resolvers: [user_1.UserResolver, lobby_1.LobbyResolver, game_1.GameResolver],
        validate: false,
    });
    const redis = new ioredis_1.Redis();
    const serverCleanup = (0, ws_2.useServer)({
        schema,
        context: () => __awaiter(void 0, void 0, void 0, function* () {
            return ({
                redis,
            });
        }),
    }, wsServer);
    app.use((0, express_session_1.default)({
        name: constants_1.COOKIE_NAME,
        store: new connect_redis_1.default({
            client: redis,
            disableTouch: true,
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365,
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.PRODUCTION === "true",
        },
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
    }));
    const apolloServer = new server_1.ApolloServer({
        schema,
        plugins: [
            (0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
            {
                serverWillStart() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return {
                            drainServer() {
                                return __awaiter(this, void 0, void 0, function* () {
                                    yield serverCleanup.dispose();
                                });
                            },
                        };
                    });
                },
            },
        ],
    });
    yield apolloServer.start();
    app.use("/graphql", (0, cors_1.default)({
        credentials: true,
        origin: ["http://localhost:3000", "https://www.ligaliter.com"],
    }), (0, body_parser_1.json)(), (0, express4_1.expressMiddleware)(apolloServer, {
        context: ({ req, res }) => __awaiter(void 0, void 0, void 0, function* () {
            return ({
                req,
                res,
                redis,
            });
        }),
    }));
    httpServer.listen(port, () => {
        console.log("> Started server on port", port);
    });
});
main();
//# sourceMappingURL=index.js.map