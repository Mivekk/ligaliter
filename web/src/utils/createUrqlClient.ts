import {
  LoginMutation,
  LogoutMutation,
  MeDocument,
  RegisterMutation,
} from "@/generated/graphql";
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
          logout: (_result: LogoutMutation, _args, cache, _info) => {
            cache.updateQuery({ query: MeDocument }, () => {
              return { me: null };
            });
          },
          register: (result: RegisterMutation, _args, cache, _info) => {
            cache.updateQuery({ query: MeDocument }, () => {
              return { me: result.register.user };
            });
          },
        },
      },
    }),
    fetchExchange,
  ],
});
