import {
  LoginMutation,
  LogoutMutation,
  MeDocument,
  RegisterMutation,
} from "@/generated/graphql";
import { cacheExchange } from "@urql/exchange-graphcache";

export const customCacheExchange = cacheExchange({
  keys: {
    LobbyQueryResponseObject: () => null,
  },
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
      endTurn: (_result, args: any, cache, _info) => {
        cache.invalidate("Query", "getPlayerTiles", {
          uuid: args.input.uuid,
        });
      },
    },
  },
});
