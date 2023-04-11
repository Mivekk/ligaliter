import Heading from "@/components/Heading";
import NavBar from "@/components/Navbar";
import Wrapper from "@/components/Wrapper";
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
    <Wrapper>
      <div className="flex items-center justify-center w-[50rem] h-[26rem] bg-secondary rounded-md gap-2.5 shadow-xl">
        <div className="w-[24rem] h-[25rem] rounded-md">
          <Heading>Players:</Heading>
          {lobbyPlayers}
        </div>
        <div className="w-[24rem] h-[25rem] rounded-md">
          <Heading>Settings:</Heading>
          <button className="w-28 h-8 bg-[#BC4749] hover:opacity-75 text-white">
            Start game
          </button>
          <br />
          <br />
          <button
            className="w-28 h-8 bg-[#BC4749] hover:opacity-75 text-white"
            onClick={() => {
              quitLobby({ uuid: lobbyUUID as string });
              router.push("/home");
            }}
          >
            Leave lobby
          </button>
        </div>
      </div>
    </Wrapper>
  );
};

export default Lobby;
