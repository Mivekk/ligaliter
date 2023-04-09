import { LogoutDocument, MeDocument } from "@/generated/graphql";
import Link from "next/link";
import React from "react";
import { useMutation, useQuery } from "urql";

const NavBar: React.FC<{}> = ({}) => {
  const [{ data }] = useQuery({ query: MeDocument });
  const [, logout] = useMutation(LogoutDocument);

  return (
    <div className="flex absolute flex-row items-center justify-between px-4 w-full h-14 bg-plt-four">
      <Link href={"/"} className="hover:opacity-75">
        home
      </Link>
      <div className="flex gap-4">
        {data?.me ? (
          <>
            {data?.me.username}
            <Link
              href={"/"}
              onClick={() => {
                logout({});
              }}
            >
              logout
            </Link>
          </>
        ) : (
          <>
            <Link href={"/login"} className="hover:opacity-75">
              login
            </Link>
            <Link href={"/register"} className="hover:opacity-75">
              register
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
