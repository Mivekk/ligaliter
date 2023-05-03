import React from "react";

interface ActiveIndicatorProps {
  data:
    | {
        activePlayer: {
          id: number;
          username: string;
        };
      }
    | null
    | undefined;
}

const ActiveIndicator: React.FC<ActiveIndicatorProps> = ({ data }) => {
  return (
    <div
      className="fixed top-14 origin-center -translate-x-1/2 left-1/2 w-[14rem] shadow-lg
        h-10 text-xl rounded-b-xl bg-darker2 z-30 text-white flex justify-center items-center"
    >
      {data?.activePlayer.username}
    </div>
  );
};

export default ActiveIndicator;
