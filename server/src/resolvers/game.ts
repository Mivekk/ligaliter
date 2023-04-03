import { User } from "../entities/User";
import { ApolloContext } from "src/types";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";

@Resolver()
export class GameResolver {
  @Mutation(() => Boolean)
  async newLobby(
    @Arg("uuid") uuid: string,
    @Ctx() { req, redis }: ApolloContext
  ): Promise<boolean> {
    const ownerId = req.session.userId;

    const owner = User.findOneBy({ id: ownerId });
    if (!owner) {
      return false;
    }

    const data = {
      owner: uuid,
      createdAt: new Date(),
    };

    redis.setex(uuid, 3600, JSON.stringify(data));

    return true;
  }
}
