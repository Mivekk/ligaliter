import StartGame from "@/components/StartGame";
import Wrapper from "@/components/Wrapper";
import { MeDocument, UsersDocument } from "@/generated/graphql";
import { useQuery } from "urql";

const Home: React.FC<{}> = ({}) => {
  const [{ data, fetching }] = useQuery({ query: UsersDocument });

  return (
    <>
      {/*<Wrapper>
      <>
        {data && !fetching
          ? data.users.map((item) => (
              <h1 key={item.id}>{item.username + ", " + item.created_at}</h1>
            ))
          : null}
        <div className="flex w-full h-screen items-center justify-center">
          <StartGame />
        </div>
      </>
    </Wrapper>*/}
      <div className="w-full h-screen bg-sky-900">
        <div className="m-10 w-40 h-10 p-4 bg-sky-800 rounded-md"></div>
      </div>
    </>
  );
};

export default Home;
