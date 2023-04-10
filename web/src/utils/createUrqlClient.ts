import {
  createClient,
  dedupExchange,
  fetchExchange,
  subscriptionExchange,
} from "urql";
import { customCacheExchange } from "./customCacheExchange";
import { createClient as createWSClient } from "graphql-ws";

const wsClient =
  typeof window !== "undefined"
    ? createWSClient({
        url: "ws://localhost:4000/graphql",
      })
    : null;

export const client = createClient({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include",
  },
  exchanges: [
    dedupExchange,
    customCacheExchange,
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
