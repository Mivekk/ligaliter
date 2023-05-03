import { createClient as createWSClient } from "graphql-ws";
import {
  debugExchange,
  dedupExchange,
  fetchExchange,
  subscriptionExchange,
} from "urql";
import { customCacheExchange } from "./customCacheExchange";

const isServerSide = typeof window === "undefined";

const wsClient = !isServerSide
  ? createWSClient({
      url: "ws://localhost:4000/graphql",
    })
  : null;

export const createUrqlClient = (ssrExchange: any) => ({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include" as const,
  },
  exchanges: [
    dedupExchange,
    customCacheExchange,
    ssrExchange,
    fetchExchange,
    subscriptionExchange({
      forwardSubscription(request) {
        const input = { ...request, query: request.query || "" };
        return {
          subscribe(sink) {
            let unsubscribe = () => {};
            if (wsClient) {
              unsubscribe = wsClient.subscribe(input, sink);
            }
            return { unsubscribe };
          },
        };
      },
    }),
  ],
});
