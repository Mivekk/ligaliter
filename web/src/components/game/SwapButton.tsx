import React from "react";

interface SwapButtonProps {
  myTurn: boolean | undefined;
}

const SwapButton: React.FC<SwapButtonProps> = ({ myTurn }) => {
  const handleOnClick = () => {
    console.log("swap");
  };

  return (
    <div
      onClick={handleOnClick}
      className={`flex flex-col items-center text-white text-2xl 
            justify-center select-none w-40 h-10 ${
              myTurn
                ? "bg-violet-600 hover:opacity-75 cursor-pointer"
                : "bg-gray-400"
            }`}
    >
      <div>SWAP</div>
    </div>
  );
};

export default SwapButton;
