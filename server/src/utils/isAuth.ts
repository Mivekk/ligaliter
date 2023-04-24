import { ApolloContext } from "src/types";
import { MiddlewareFn } from "type-graphql";

export const isAuth: MiddlewareFn<ApolloContext> = async (
  { context },
  next
) => {
  if (context.req.session.userId === undefined) {
    throw new Error("Not authenticated");
  }

  return next();
};
