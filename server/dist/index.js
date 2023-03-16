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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
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
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield data_source_1.AppDataSource.initialize();
    const app = (0, express_1.default)();
    const port = 4000;
    const redis = new ioredis_1.Redis();
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
            secure: false,
        },
        secret: "ugabugahehe",
        resave: false,
        saveUninitialized: false,
    }));
    const apolloServer = new server_1.ApolloServer({
        schema: yield (0, type_graphql_1.buildSchema)({
            resolvers: [user_1.UserResolver],
            validate: false,
        }),
    });
    yield apolloServer.start();
    app.use("/graphql", (0, cors_1.default)(), (0, body_parser_1.json)(), (0, express4_1.expressMiddleware)(apolloServer, {
        context: ({ req, res }) => __awaiter(void 0, void 0, void 0, function* () {
            return ({
                req,
                res,
                redis,
            });
        }),
    }));
    app.listen(port, () => {
        console.log("> Started server on port", port);
    });
});
main();
//# sourceMappingURL=index.js.map