import { LobbyPlayersQueryDocument } from "@/generated/graphql";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "urql";

const ActivePlayers: React.FC<{}> = () => {
  const router = useRouter();
  const gameId = router.query.gameId as string;

  const [{ data }] = useQuery({
    query: LobbyPlayersQueryDocument,
    variables: { uuid: gameId },
    requestPolicy: "cache-and-network",
  });

  const activePlayers = data?.lobbyPlayersQuery.players?.map((item) => (
    <div key={item.id}>{item.username}</div>
  ));

  return <div className="">{activePlayers}</div>;
};

export default ActivePlayers;
