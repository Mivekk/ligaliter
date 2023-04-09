import Heading from "@/components/Heading";
import NavBar from "@/components/Navbar";
import { LobbyPlayersDocument } from "@/generated/graphql";
import { isAuth } from "@/utils/isAuth";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "urql";

const Lobby: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [{ data }] = useQuery({
    query: LobbyPlayersDocument,
    variables: { uuid: `${router.query.lobbyId}` },
    requestPolicy: "network-only",
  });

  const lobbyPlayers = data
    ? data.lobbyPlayers?.map((item) => <div>{item.username}</div>)
    : null;

  isAuth();

  return (
    <>
      <NavBar />
      <div className="flex w-full h-screen items-center justify-center bg-plt-four">
        <div className="flex items-center justify-center w-[50rem] h-[26rem] bg-plt-three rounded-md gap-2.5">
          <div className="w-[24rem] h-[25rem] border border-black rounded-md p-4">
            <Heading>Players:</Heading>
            {lobbyPlayers}
          </div>
          <div className="w-[24rem] h-[25rem] border border-black rounded-md p-4">
            <Heading>Settings:</Heading>
            <button
              type="submit"
              className="w-28 h-8 bg-plt-one hover:opacity-75 text-white"
            >
              Start game
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Lobby;
