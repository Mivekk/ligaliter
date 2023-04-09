import { createClient, dedupExchange, fetchExchange } from "urql";
import { customCacheExchange } from "./customCacheExchange";

export const client = createClient({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include",
  },
  exchanges: [dedupExchange, customCacheExchange, fetchExchange],
});
