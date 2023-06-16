import React from "react";
import { useRouter } from "next/router";
import { LogoutDocument, MeDocument } from "@/generated/graphql";
import { useMutation, useQuery } from "urql";

const NavBarMenu: React.FC<{}> = () => {
  const router = useRouter();

  const [{ data }] = useQuery({
    query: MeDocument,
    requestPolicy: "cache-and-network",
  });
  const [, logout] = useMutation(LogoutDocument);

  return (
    <>
      <button onClick={() => router.push("/home")} className="hover:opacity-75">
        Home
      </button>
      <div className="flex gap-4">
        {data?.me ? (
          <>
            Logged as: {data?.me.username}
            <div>|</div>
            <button onClick={() => logout({})}>Logout</button>
          </>
        ) : (
          <>
            <button
              className="hover:opacity-75"
              onClick={() => router.push("/login")}
            >
              Login
            </button>
            <div>|</div>
            <button
              className="hover:opacity-75"
              onClick={() => router.push("/register")}
            >
              Register
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default NavBarMenu;
