import { User } from "../entities/User";
import { ApolloContext, LobbyData } from "../types";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class GameResolver {
  @Mutation(() => Boolean)
  async newLobby(
    @Arg("uuid") uuid: string,
    @Ctx() { req, redis }: ApolloContext
  ): Promise<boolean> {
    const ownerId = req.session.userId;

    const owner = User.findOneBy({ id: ownerId });
    if (!owner || !ownerId) {
      return false;
    }

    const data: LobbyData = {
      owner: ownerId,
      createdAt: new Date(),
      players: [{ id: ownerId }],
    };

    redis.setex(uuid, 3600, JSON.stringify(data));

    return true;
  }

  @Query(() => [User], { nullable: true })
  async lobbyPlayers(
    @Arg("uuid") uuid: string,
    @Ctx() { redis }: ApolloContext
  ): Promise<User[] | null> {
    const lobbyData = await redis.get(uuid);
    if (!lobbyData) {
      return null;
    }

    const playersData = JSON.parse(lobbyData) as LobbyData;
    const players = playersData.players.map(async (item) => {
      const user = await User.findOneBy({ id: item.id });
      if (!user) {
        return null;
      }
      return user;
    });

    console.log(playersData);

    return players;
  }
}

/*

h1 {
  dasdas: asd
}

????


*/
