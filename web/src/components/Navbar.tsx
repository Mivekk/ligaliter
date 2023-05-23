import { LogoutDocument, MeDocument } from "@/generated/graphql";
import { useRouter } from "next/router";
import React from "react";
import { useMutation, useQuery } from "urql";

interface NavBarProps {
  warnOnLeave?: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ warnOnLeave }) => {
  const router = useRouter();

  const [{ data }] = useQuery({ query: MeDocument });
  const [, logout] = useMutation(LogoutDocument);

  return (
    <>
      <div
        className="flex absolute bg-darker1 flex-row items-center justify-between px-6
          w-full sm:h-14 h-8 text-md text-black z-20"
      >
        <button
          onClick={() => router.push("/home")}
          className="hover:opacity-75"
        >
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
      </div>
    </>
  );
};

export default NavBar;
