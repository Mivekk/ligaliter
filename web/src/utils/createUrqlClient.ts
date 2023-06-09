import { createClient as createWSClient } from "graphql-ws";
import { dedupExchange, fetchExchange, subscriptionExchange } from "urql";
import { customCacheExchange } from "./customCacheExchange";

const isServerSide = typeof window === "undefined";

const wsClient = !isServerSide
  ? createWSClient({
      url: process.env.NEXT_PUBLIC_WEBSOCKET_ENDPOINT!,
    })
  : null;

export const createUrqlClient = (ssrExchange: any) => ({
  url: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!,
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
