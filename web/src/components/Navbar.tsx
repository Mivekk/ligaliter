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

  const popupLogic = (path: string) => {
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
      <div className="flex absolute flex-row items-center justify-between px-4 w-full h-14 bg-plt-four">
        <button onClick={() => popupLogic("/")} className="hover:opacity-75">
          home
        </button>
        <div className="flex gap-4">
          {data?.me ? (
            <>
              {data?.me.username}
              <button onClick={() => popupLogic("/?logout")}>logout</button>
            </>
          ) : (
            <>
              <button
                className="hover:opacity-75"
                onClick={() => popupLogic("/login")}
              >
                login
              </button>
              <button
                className="hover:opacity-75"
                onClick={() => popupLogic("/register")}
              >
                register
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default NavBar;
