import NavBar from "@/components/Navbar";
import StartGame from "@/components/StartGame";
import Wrapper from "@/components/Wrapper";

const Home: React.FC<{}> = ({}) => {
  return (
    <Wrapper>
      <div className="flex w-full h-screen items-center justify-center">
        <StartGame />
      </div>
    </Wrapper>
  );
};

export default Home;
