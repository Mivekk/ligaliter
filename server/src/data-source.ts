import { DataSource } from "typeorm";
import { Game } from "./entities/Game";
import { User } from "./entities/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "ligaliter",
  synchronize: true,
  logging: true,
  entities: [User, Game],
});
