import CreateLobby from "@/components/CreateLobby";
import JoinLobby from "@/components/JoinLobby";
import Wrapper from "@/components/Wrapper";
import { isAuth } from "@/utils/isAuth";
import React, { useState } from "react";

const Home: React.FC<{}> = ({}) => {
  const [isCreatingLobby, setIsCreatingLobby] = useState(true);

  isAuth();

  return (
    <Wrapper>
      <div className="flex flex-col justify-center items-center w-[26rem] h-[18rem] bg-secondary rounded-md shadow-xl">
        <div className="flex absolute w-[26rem] h-[18rem] justify-between items-start -translate-y-6">
          <button
            onClick={() => setIsCreatingLobby(true)}
            className={`w-[14rem] h-10 bg-secondary rounded-xl flex items-start justify-center ${
              isCreatingLobby ? null : "opacity-75"
            }`}
          >
            Create
          </button>
          <button
            onClick={() => setIsCreatingLobby(false)}
            className={`w-[14rem] h-10 bg-secondary rounded-xl flex items-start justify-center ${
              isCreatingLobby ? "opacity-75" : null
            }`}
          >
            Join
          </button>
        </div>
        <div className="z-10">
          {isCreatingLobby ? <CreateLobby /> : <JoinLobby />}
        </div>
      </div>
    </Wrapper>
  );
};

export default Home;
