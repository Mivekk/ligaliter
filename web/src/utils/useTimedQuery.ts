import { DocumentNode } from "graphql";
import { useEffect } from "react";
import { useQuery } from "urql";

export const useTimedQuery = (query: DocumentNode, variables: {}) => {
  const [result, reexecuteQuery] = useQuery({
    query,
    variables,
    requestPolicy: "network-only",
  });

  useEffect(() => {
    if (result.fetching) {
      return;
    }
    const timerId = setTimeout(() => {
      reexecuteQuery({ requestPolicy: "network-only" });
    }, 1000);

    return () => clearTimeout(timerId);
  }, [result.fetching, reexecuteQuery]);

  return result;
};
