import {
  GetPlayerStatsDocument,
  UpdatePlayerStatsDocument,
} from "@/generated/graphql";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { HiMenuAlt2 } from "react-icons/hi";
import { useQuery, useSubscription } from "urql";
import { motion } from "framer-motion";
import Heading from "./Heading";
import NavBarMenu from "./NavBarMenu";

const NavBar: React.FC<{}> = () => {
  const router = useRouter();
  const gameId = router.query.gameId;

  const [{ data: queryData }] = useQuery({
    query: GetPlayerStatsDocument,
    variables: { uuid: gameId as string },
    pause: !gameId,
  });

  const [{ data: subscriptionData }] = useSubscription({
    query: UpdatePlayerStatsDocument,
    variables: { uuid: gameId as string },
    pause: !gameId,
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

  const dropdownVariants = {
    open: {
      height: "auto",
      transition: {
        duration: 0.13,
        ease: "easeOut",
      },
    },
    closed: {
      height: 0,
      transition: {
        duration: 0.13,
        ease: "easeIn",
      },
    },
  };

  return (
    <>
      {!players ? (
        <div className="absolute flex bg-darker1 flex-row items-center justify-between px-6 w-full h-14 text-md text-black z-20">
          <NavBarMenu />
        </div>
      ) : (
        <>
          <div className="absolute sm:flex hidden bg-darker1 flex-row items-center justify-between px-6 w-full h-14 text-md text-black z-20">
            <NavBarMenu />
          </div>
          <div
            className={`fixed z-50 sm:hidden flex flex-col w-full h-fit max-h-screen bg-darker1 ${
              showMenu ? "rounded-b-xl" : ""
            }`}
          >
            <HiMenuAlt2
              className="w-7 h-7 ml-1 mb-1 mt-1"
              onClick={() => setShowMenu((prev) => !prev)}
            />
            <motion.div
              initial="closed"
              animate={showMenu ? "open" : "closed"}
              exit="closed"
              className="overflow-hidden"
              variants={dropdownVariants}
              onAnimationComplete={
                showMenu ? undefined : () => setShowMenu(false)
              }
            >
              <div>
                <Heading>Players</Heading>
                <div className="flex flex-col text-lg">{players}</div>
              </div>
              <div className="flex self-center w-[95%] h-[1px] bg-black my-1"></div>
              <div className="flex flex-col items-center gap-1 text-lg pb-2">
                <NavBarMenu />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </>
  );
};

export default NavBar;
