import React from "react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "@/utils/createUrqlClient";

const Game: React.FC<{}> = ({}) => {
  return <div className="bg-main w-full h-screen text-white">New game</div>;
};

export default withUrqlClient(createUrqlClient)(Game);
