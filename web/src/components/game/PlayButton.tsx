import { EndTurnDocument } from "@/generated/graphql";
import { useRouter } from "next/router";
import React from "react";
import { useMutation } from "urql";
import { motion } from "framer-motion";

interface PlayButtonProps {
  isValid: boolean;
  playPointCount: number;
}

const PlayButton: React.FC<PlayButtonProps> = ({ isValid, playPointCount }) => {
  const router = useRouter();
  const gameId = router.query.gameId as string;

  const [, endTurn] = useMutation(EndTurnDocument);

  const handleOnClick = () => {
    if (!isValid) {
      return;
    }

    endTurn({ input: { uuid: gameId, points: playPointCount } });
  };

  const buttonVariants = {
    initial: {
      height: "2.5rem",
    },
    valid: {
      height: "5rem",
    },
  };

  return (
    <motion.div
      onClick={handleOnClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      variants={buttonVariants}
      initial={isValid ? "valid" : "initial"}
      animate={isValid ? "valid" : "initial"}
      className={`flex flex-col items-center text-white text-2xl justify-center 
        sm:w-52 w-full overflow-hidden
      ${
        isValid
          ? "h-20 flex-col bg-violet-600 rounded-xl cursor-pointer"
          : "h-10 bg-gray-400"
      }`}
    >
      <div>PLAY</div>
      <div>{isValid ? `${playPointCount} PTS` : null}</div>
    </motion.div>
  );
};

export default PlayButton;
