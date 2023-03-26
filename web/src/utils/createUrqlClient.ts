import { LoginMutation, LogoutMutation, MeDocument } from "@/generated/graphql";
import { cacheExchange } from "@urql/exchange-graphcache";
import { createClient, dedupExchange, fetchExchange } from "urql";

export const client = createClient({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include",
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          login: (result: LoginMutation, _args, cache, _info) => {
            cache.updateQuery({ query: MeDocument }, () => {
              return { me: result.login.user };
            });
          },
          logout: (result: LogoutMutation, _args, cache, _info) => {
            cache.updateQuery({ query: MeDocument }, () => {
              return { me: null };
            });
          },
        },
      },
    }),
    fetchExchange,
  ],
});
