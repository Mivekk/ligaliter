import CreateLobby from "@/components/lobby/CreateLobby";
import JoinLobby from "@/components/lobby/JoinLobby";
import Wrapper from "@/components/Wrapper";
import React, { useState } from "react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "@/utils/createUrqlClient";

const Home: React.FC<{}> = ({}) => {
  const [isCreatingLobby, setIsCreatingLobby] = useState(true);

  return (
    <Wrapper>
      <div className="flex flex-col items-center sm:w-[26rem] w-[22.5rem] h-[18rem] bg-secondary rounded-md shadow-x">
        <div className="flex sm:w-[26rem] w-[22.5rem] justify-between -translate-y-6">
          <button
            onClick={() => setIsCreatingLobby(true)}
            className={`w-full h-[1.7rem] bg-secondary rounded-t-xl flex justify-center ${
              isCreatingLobby ? null : "opacity-75"
            }`}
          >
            Create
          </button>
          <button
            onClick={() => setIsCreatingLobby(false)}
            className={`w-full h-[1.7rem] bg-secondary rounded-t-xl flex justify-center ${
              isCreatingLobby ? "opacity-75" : null
            }`}
          >
            Join
          </button>
        </div>
        <div className="z-10 mt-auto mb-auto -translate-y-6">
          {isCreatingLobby ? <CreateLobby /> : <JoinLobby />}
        </div>
      </div>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Home);
