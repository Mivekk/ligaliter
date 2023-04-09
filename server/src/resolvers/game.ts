import { Arg, Mutation, Resolver } from "type-graphql";
import { ResponseObject } from "./user";

@Resolver()
export class GameResolver {
  @Mutation(() => ResponseObject)
  async newGame(@Arg("uuid") _uuid: string): Promise<ResponseObject> {
    console.log("nowa gra");

    return {
      error: {
        field: "",
        message: "",
      },
    };
  }
}
