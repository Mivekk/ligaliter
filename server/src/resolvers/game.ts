import { Arg, Field, Mutation, ObjectType, Resolver } from "type-graphql";

@ObjectType()
class GameFieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class GameResponseObject {
  @Field(() => GameFieldError, { nullable: true })
  error?: GameFieldError;

  @Field(() => Boolean)
  success: boolean;
}

@Resolver()
export class GameResolver {
  @Mutation(() => GameResponseObject)
  async newGame(@Arg("uuid") _uuid: string): Promise<GameResponseObject> {
    console.log("nowa gra");

    return {
      success: true,
    };
  }
}
