import React, { useState } from "react";
import { HiMenuAlt2 } from "react-icons/hi";
import NavBarMenu from "./NavBarMenu";
import ActivePlayers from "./game/ActivePlayers";
import {
  GetPlayerStatsDocument,
  UpdatePlayerStatsDocument,
} from "@/generated/graphql";
import { useRouter } from "next/router";
import { useQuery, useSubscription } from "urql";
import Heading from "./Heading";

const NavBar: React.FC<{}> = () => {
  const router = useRouter();
  const gameId = router.query.gameId as string;

  const [{ data: queryData }] = useQuery({
    query: GetPlayerStatsDocument,
    variables: { uuid: gameId },
  });

  const [{ data: subscriptionData }] = useSubscription({
    query: UpdatePlayerStatsDocument,
    variables: { uuid: gameId },
  });

  const data = subscriptionData?.updatePlayerStats || queryData?.getPlayerStats;

  const players = data?.players
    .sort((a, b) => (a.points < b.points ? 1 : a.points === b.points ? 0 : -1))
    .map((item) => (
      <div key={item.id}>
        {item.username} {item.points}
      </div>
    ));

  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <div
        className="hidden sm:flex absolute bg-darker1 flex-row items-center justify-between px-6
          w-full h-14 text-md text-black z-20"
      >
        <NavBarMenu />
      </div>
      {showMenu ? (
        <div
          className="sm:hidden fixed z-50 flex flex-col w-full h-fit max-h-screen
          bg-darker1 rounded-b-2xl select-none"
        >
          <HiMenuAlt2
            className="w-7 h-7 ml-1 mb-1 mt-1"
            onClick={() => setShowMenu(false)}
          />
          <div className="ml-4">
            <Heading>Players</Heading>
            <div className="flex flex-col text-lg">{players}</div>
          </div>
          <div className="flex self-center w-[95%] h-[1px] bg-black my-1"></div>
          <div className="flex flex-col items-center gap-1 text-lg pb-2">
            <NavBarMenu />
          </div>
        </div>
      ) : (
        <div className="sm:hidden fixed z-50 flex w-full h-8 bg-darker1">
          <HiMenuAlt2
            className="w-7 h-7 ml-1 select-none"
            onClick={() => setShowMenu(true)}
          />
        </div>
      )}
    </>
  );
};

export default NavBar;
