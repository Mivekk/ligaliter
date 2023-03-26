import Link from "next/link";
import React from "react";

interface StartGameProps {}

const StartGame: React.FC<StartGameProps> = () => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-xl text-bold">Click here to start new game</div>
      <Link
        href={"/newgame"}
        className="px-8 py-2 bg-plt-one text-white mt-2 hover:opacity-75"
      >
        New game
      </Link>
    </div>
  );
};

export default StartGame;
