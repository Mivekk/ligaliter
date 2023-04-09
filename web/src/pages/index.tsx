import JoinLobby from "@/components/JoinLobby";
import NavBar from "@/components/Navbar";
import SelectLobby from "@/components/SelectLobby";
import { useState } from "react";

const Index: React.FC<{}> = ({}) => {
  const [selectLobby, setSelectLobby] = useState(true);

  return (
    <>
      <NavBar />
      <div className="w-full h-screen flex justify-center items-center bg-plt-four">
        <div className="flex justify-center items-center w-[26rem] h-[10rem] bg-plt-three rounded-md">
          {selectLobby ? (
            <SelectLobby setSelectLobby={setSelectLobby} />
          ) : (
            <JoinLobby setSelectLobby={setSelectLobby} />
          )}
        </div>
      </div>
    </>
  );
};

export default Index;
