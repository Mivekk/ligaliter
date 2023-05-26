import { createUrqlClient } from "@/utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

const Index: React.FC<{}> = ({}) => {
  const router = useRouter();

  return (
    <div className="flex flex-col w-full h-screen items-center justify-center bg-main">
      <div className="text-white text-8xl font-home font-bold -translate-y-8 drop-shadow-md">
        <div className="rotate-[3deg]">LIGA</div>
        <div className="rotate-[-10deg]">LITER</div>
      </div>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="w-[14rem] h-[3.5rem] bg-utility text-white text-lg rounded-xl font-normal sm:select-auto"
        onClick={() => {
          router.push("/home");
        }}
      >
        Get started!
      </motion.button>
    </div>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
