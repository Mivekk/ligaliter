import { LogoutDocument, MeDocument } from "@/generated/graphql";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useMutation, useQuery } from "urql";
import Popup from "./Popup";

interface NavBarProps {
  warnOnLeave?: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ warnOnLeave }) => {
  const router = useRouter();

  const [{ data }] = useQuery({ query: MeDocument });
  const [, logout] = useMutation(LogoutDocument);

  const [popupOpen, setPopupOpen] = useState(false);
  const [urlTo, setUrlTo] = useState("/");

  const popupTriggered = (path: string) => {
    if (warnOnLeave) {
      setUrlTo(path);
      setPopupOpen(true);
    } else {
      router.push(path);
      if (path === "/?logout") {
        logout({});
      }
    }
  };

  return (
    <>
      <Popup
        active={popupOpen}
        onClose={(result) => {
          if (result) {
            router.push(urlTo);
            if (urlTo === "/?logout") {
              logout({});
            }
          }
          setPopupOpen(false);
        }}
      >
        <div>Moj maly popup</div>
      </Popup>
      <div
        className="flex absolute flex-row items-center justify-between px-6 w-full 
      h-14 text-md bg-darker1 shadow-sm shadow-darker2 text-white z-20"
      >
        <button
          onClick={() => popupTriggered("/home")}
          className="hover:opacity-75"
        >
          Home
        </button>
        <div className="flex gap-4">
          {data?.me ? (
            <>
              Logged as: {data?.me.username}
              <div>|</div>
              <button onClick={() => popupTriggered("/?logout")}>Logout</button>
            </>
          ) : (
            <>
              <button
                className="hover:opacity-75"
                onClick={() => popupTriggered("/login")}
              >
                Login
              </button>
              <div>|</div>
              <button
                className="hover:opacity-75"
                onClick={() => popupTriggered("/register")}
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
