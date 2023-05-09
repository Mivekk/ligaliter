import { MeDocument } from "@/generated/graphql";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery } from "urql";

export const useAuth = () => {
  const [{ data, fetching }] = useQuery({ query: MeDocument });
  const router = useRouter();

  useEffect(() => {
    if (!fetching && !data?.me) {
      router.replace("/login");
    }
  }, [fetching, data]);
};
