import Heading from "@/components/Heading";
import NavBar from "@/components/Navbar";
import {
  LobbyPlayersDocument,
  LobbyPlayersQueryDocument,
  QuitLobbyDocument,
} from "@/generated/graphql";
import { isAuth } from "@/utils/isAuth";
import { useRouter } from "next/router";
import React from "react";
import { useQuery, useSubscription, useMutation } from "urql";

const Lobby: React.FC<{}> = ({}) => {
  const router = useRouter();
  const lobbyUUID = router.query.lobbyId;

  const [{ data: queryData }] = useQuery({
    query: LobbyPlayersQueryDocument,
    variables: { uuid: lobbyUUID as string },
  });

  const [, quitLobby] = useMutation(QuitLobbyDocument);

  const [{ data }] = useSubscription({
    query: LobbyPlayersDocument,
    variables: { uuid: lobbyUUID as string },
  });

  let lobbyPlayers = null;
  if (queryData && !data) {
    // first fetch
    lobbyPlayers = queryData.lobbyPlayersQuery?.map((item) => (
      <div key={item.id}>{item.username}</div>
    ));
  } else if (data) {
    // second and consecutive fetches
    lobbyPlayers = data.lobbyPlayers?.map((item) => (
      <div key={item.id}>{item.username}</div>
    ));
  }

  isAuth();

  return (
    <>
      <NavBar warnOnLeave />
      <div className="flex w-full h-screen items-center justify-center bg-plt-four">
        <div className="flex items-center justify-center w-[50rem] h-[26rem] bg-plt-three rounded-md gap-2.5">
          <div className="w-[24rem] h-[25rem] border border-black rounded-md p-4">
            <Heading>Players:</Heading>
            {lobbyPlayers}
          </div>
          <div className="w-[24rem] h-[25rem] border border-black rounded-md p-4">
            <Heading>Settings:</Heading>
            <button className="w-28 h-8 bg-plt-one hover:opacity-75 text-white">
              Start game
            </button>
            <br />
            <br />
            <button
              className="w-28 h-8 bg-plt-one hover:opacity-75 text-white"
              onClick={() => {
                quitLobby({ uuid: lobbyUUID as string });
                router.push("/");
              }}
            >
              Leave lobby
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Lobby;
