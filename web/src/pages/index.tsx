import { MeDocument } from "@/generated/graphql";
import { useQuery } from "urql";
import { useRouter } from "next/router";
import { useEffect } from "react";
import StartGame from "@/components/StartGame";
import Wrapper from "@/components/Wrapper";

const Index: React.FC<{}> = ({}) => {
  const [{ data, fetching }] = useQuery({ query: MeDocument });
  const router = useRouter();

  useEffect(() => {
    if (!fetching && !data?.me) {
      router.replace("/login");
    }
  }, [fetching, data]);

  return (
    <Wrapper>
      <div className="w-full h-screen flex justify-center items-center bg-plt-four">
        <div className="flex justify-center items-center w-[26rem] h-[10rem] bg-plt-three rounded-md">
          <StartGame />
        </div>
      </div>
    </Wrapper>
  );
};

export default Index;
