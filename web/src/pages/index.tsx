import { MeDocument } from "@/generated/graphql";
import { useQuery } from "urql";
import { useRouter } from "next/router";

const Index: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [{ data, fetching }] = useQuery({ query: MeDocument });

  return (
    <div className="flex flex-col w-full h-screen items-center justify-center bg-main">
      <div className="text-white text-8xl font-home font-bold -translate-y-8 drop-shadow-md">
        <div className="rotate-[3deg]">LIGA</div>
        <div className="rotate-[-10deg]">LITER</div>
      </div>
      <button
        className="w-[14rem] h-[3.5rem] bg-utility hover:opacity-75 text-white text-lg rounded-xl mt-10 font-normal -translate-y-8"
        onClick={() => {
          if (data?.me && !fetching) {
            router.push("/home");
          } else if (!data?.me && !fetching) {
            router.push("/login");
          }
        }}
      >
        Get started!
      </button>
    </div>
  );
};

export default Index;
