import { DataSource } from "typeorm";
import { Game } from "./entities/Game";
import { User } from "./entities/User";
import { __prod__ } from "./constants";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOSTNAME,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  entities: [User, Game],
  ssl: {
    rejectUnauthorized: false,
  },
});
