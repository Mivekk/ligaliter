import React from "react";
import Heading from "../Heading";

interface ActivePlayersProps {
  data:
    | {
        players: {
          id: number;
          username: string;
          points: number;
        }[];
      }
    | null
    | undefined;
}

const ActivePlayers: React.FC<ActivePlayersProps> = ({ data }) => {
  const players = data?.players
    .sort((a, b) => (a.points < b.points ? 1 : a.points === b.points ? 0 : -1))
    .map((item) => (
      <div key={item.id}>
        {item.username} {item.points}
      </div>
    ));

  return (
    <div
      className="fixed sm:flex hidden flex-col items-center z-40 bg-darker1 text-white rounded-xl 
         w-52 h-fit pb-2 top-20 right-8 shadow-lg"
    >
      <Heading>Players</Heading>
      {players}
    </div>
  );
};

export default ActivePlayers;
