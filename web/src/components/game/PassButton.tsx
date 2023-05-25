import { EndTurnDocument } from "@/generated/graphql";
import { useRouter } from "next/router";
import React from "react";
import { useMutation } from "urql";
import { motion } from "framer-motion";

interface PassButtonProps {
  myTurn: boolean | undefined;
}

const PassButton: React.FC<PassButtonProps> = ({ myTurn }) => {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const [, endTurn] = useMutation(EndTurnDocument);

  const handleOnClick = () => {
    if (!myTurn) {
      return;
    }

    endTurn({ input: { uuid: gameId, points: 0 } });
  };

  return (
    <motion.div
      onClick={handleOnClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`flex flex-col items-center text-white text-2xl 
        justify-center select-none sm:w-40 w-full h-10 ${
          myTurn ? "bg-violet-600 cursor-pointer" : "bg-gray-400"
        }`}
    >
      <div>PASS</div>
    </motion.div>
  );
};

export default PassButton;
