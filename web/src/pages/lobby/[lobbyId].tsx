import Button from "@/components/Button";
import Heading from "@/components/Heading";
import Wrapper from "@/components/Wrapper";
import {
  LobbyPlayersDocument,
  LobbyPlayersQueryDocument,
  MeDocument,
  QuitLobbyDocument,
} from "@/generated/graphql";
import { isAuth } from "@/utils/isAuth";
import { useRouter } from "next/router";
import React from "react";
import { useMutation, useQuery, useSubscription } from "urql";

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
      <div key={item.id} className="text-xl">
        {item.username}
      </div>
    ));
  } else if (data) {
    // second and consecutive fetches
    lobbyPlayers = data.lobbyPlayers?.map((item) => (
      <div key={item.id} className="text-xl">
        {item.username}
      </div>
    ));
  }

  isAuth();

  return (
    <Wrapper>
      <div className="flex flex-col items-center justify-center w-[50rem] h-[26rem] bg-secondary rounded-md gap-2.5 shadow-xl">
        <Heading>Players:</Heading>
        {lobbyPlayers}
        <div className="flex gap-2">
          <Button>Start game</Button>
          <Button
            onClick={() => {
              quitLobby({ uuid: lobbyUUID as string });
              router.push("/home");
            }}
          >
            Leave lobby
          </Button>
        </div>
      </div>
    </Wrapper>
  );
};

export default Lobby;
