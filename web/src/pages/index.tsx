import PickLobby from "@/components/PickLobby";
import Wrapper from "@/components/Wrapper";
import { isAuth } from "@/utils/isAuth";

const Index: React.FC<{}> = ({}) => {
  isAuth();

  return (
    <Wrapper>
      <div className="w-full h-screen flex justify-center items-center bg-plt-four">
        <div className="flex justify-center items-center w-[26rem] h-[10rem] bg-plt-three rounded-md">
          <PickLobby />
        </div>
      </div>
    </Wrapper>
  );
};

export default Index;
