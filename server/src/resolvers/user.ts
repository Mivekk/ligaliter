import { User } from "../entities/User";
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  InputType,
  Field,
  ObjectType,
  Ctx,
} from "type-graphql";
import argon2 from "argon2";
import { ApolloContext } from "../types";

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class ResponseObject {
  @Field(() => FieldError, { nullable: true })
  error?: FieldError;

  @Field(() => User, { nullable: true })
  user?: User;
}

@InputType()
class LoginInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@InputType()
class RegisterInput extends LoginInput {
  @Field()
  email: string;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: ApolloContext): Promise<User | null> {
    if (!req.session.userId) {
      return null;
    }

    const user = await User.findOneBy({ id: req.session.userId });
    return user;
  }

  @Query(() => [User])
  async users(): Promise<User[]> {
    return User.find();
  }

  @Mutation(() => User)
  async register(@Arg("options") options: RegisterInput): Promise<User> {
    const hashedPassword = await argon2.hash(options.password);

    const user = await User.create({
      ...options,
      password: hashedPassword,
    }).save();

    return user;
  }

  @Mutation(() => ResponseObject)
  async login(
    @Arg("options") { username, password }: LoginInput,
    @Ctx() { req }: ApolloContext
  ): Promise<ResponseObject> {
    const user = await User.findOneBy({ username });
    if (!user) {
      return {
        error: {
          field: "username",
          message: "user not found",
        },
      };
    }

    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        error: {
          field: "password",
          message: "passwords do not match",
        },
      };
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req }: ApolloContext): Promise<boolean> {
    return true;
  }
}
