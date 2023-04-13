import Button from "@/components/Button";
import Heading from "@/components/Heading";
import Wrapper from "@/components/Wrapper";
import {
  LobbyPlayersDocument,
  LobbyPlayersQueryDocument,
  MeDocument,
  NewGameDocument,
  QuitLobbyDocument,
} from "@/generated/graphql";
import { isAuth } from "@/utils/isAuth";
import { useRouter } from "next/router";
import React from "react";
import { useMutation, useQuery, useSubscription } from "urql";

const Lobby: React.FC<{}> = ({}) => {
  const router = useRouter();
  const lobbyUUID = router.query.lobbyId;

  const [{ data: meData }] = useQuery({ query: MeDocument });

  const [{ data: queryData }] = useQuery({
    query: LobbyPlayersQueryDocument,
    variables: { uuid: lobbyUUID as string },
  });

  const [{ data: subscriptionData }] = useSubscription({
    query: LobbyPlayersDocument,
    variables: { uuid: lobbyUUID as string },
  });

  const [, quitLobby] = useMutation(QuitLobbyDocument);

  const [, newGame] = useMutation(NewGameDocument);

  const initialPlayers = queryData?.lobbyPlayersQuery?.players?.map((item) => (
    <div key={item.id} className="text-xl">
      {item.username}
    </div>
  ));

  const subsequentPlayers = subscriptionData?.lobbyPlayers?.players?.map(
    (item) => (
      <div key={item.id} className="text-xl">
        {item.username}
      </div>
    )
  );

  if (subscriptionData?.lobbyPlayers.started) {
    router.push(`/game/${lobbyUUID}`);
  }

  const isOwner = queryData?.lobbyPlayersQuery.owner?.id === meData?.me?.id;

  isAuth();

  return (
    <Wrapper>
      <div className="flex flex-col items-center justify-center w-[50rem] h-[26rem] bg-secondary rounded-md gap-2.5 shadow-xl">
        <Heading>Players:</Heading>
        {subsequentPlayers ? subsequentPlayers : initialPlayers}
        <div className="flex gap-2">
          <Button
            onClick={async () => {
              const response = await newGame({ uuid: lobbyUUID as string });
            }}
            disabled={isOwner ? false : true}
          >
            Start game
          </Button>
          <Button
            onClick={async () => {
              await quitLobby({ uuid: lobbyUUID as string });
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
