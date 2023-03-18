import Link from "next/link";
import React from "react";

interface StartGameProps {}

const StartGame: React.FC<StartGameProps> = () => {
  return (
    <div className="flex flex-col items-center">
      <div>Click here to start new game</div>
      <Link
        href={"/newgame"}
        className="border px-8 py-2 bg-lime-400 text-white mt-2 hover:opacity-75"
      >
        New game
      </Link>
    </div>
  );
};

export default StartGame;
