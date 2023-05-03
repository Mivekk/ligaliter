import Button from "@/components/Button";
import Heading from "@/components/Heading";
import Wrapper from "@/components/Wrapper";
import {
  GetLobbyPlayersDocument,
  MeDocument,
  NewGameDocument,
  QuitLobbyDocument,
  UpdateLobbyPlayersDocument,
} from "@/generated/graphql";
import { createUrqlClient } from "@/utils/createUrqlClient";
import { isAuth } from "@/utils/isAuth";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { useMutation, useQuery, useSubscription } from "urql";

const Lobby: React.FC<{}> = ({}) => {
  const router = useRouter();
  const lobbyUUID = router.query.lobbyId as string;

  const [{ data: meData }] = useQuery({ query: MeDocument });

  const [{ data: queryData }] = useQuery({
    query: GetLobbyPlayersDocument,
    variables: { uuid: lobbyUUID },
  });

  const [{ data: subscriptionData }] = useSubscription({
    query: UpdateLobbyPlayersDocument,
    variables: { uuid: lobbyUUID },
  });

  const [, quitLobby] = useMutation(QuitLobbyDocument);
  const [, newGame] = useMutation(NewGameDocument);

  const data =
    subscriptionData?.updateLobbyPlayers || queryData?.getLobbyPlayers;

  const players = data?.players?.map((item) => (
    <div key={item.id} className="text-xl">
      {item.username}
    </div>
  ));

  if (subscriptionData?.updateLobbyPlayers.started) {
    router.push(`/game/${lobbyUUID}`);
  }

  const isOwner = queryData?.getLobbyPlayers.owner?.id === meData?.me?.id;

  isAuth();

  return (
    <Wrapper>
      <div className="flex flex-col items-center justify-center w-[50rem] h-[26rem] bg-secondary rounded-md gap-2.5 shadow-xl">
        <Heading>Players:</Heading>
        {players}
        <div className="flex gap-2">
          <Button
            onClick={async () => {
              await newGame({ uuid: lobbyUUID });
            }}
            disabled={
              data?.players && isOwner && data.players.length > 1 ? false : true
            }
          >
            Start game
          </Button>
          <Button
            onClick={async () => {
              await quitLobby({ uuid: lobbyUUID });
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

export default withUrqlClient(createUrqlClient)(Lobby);
