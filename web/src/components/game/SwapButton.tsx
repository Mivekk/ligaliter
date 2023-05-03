import React from "react";

interface SwapButtonProps {}

const SwapButton: React.FC<SwapButtonProps> = () => {
  const handleOnClick = () => {
    console.log("swap");
  };

  return (
    <div
      onClick={handleOnClick}
      className={`flex flex-col items-center text-white text-2xl 
            justify-center select-none w-40 h-10 bg-gray-400`}
    >
      <div>SWAP</div>
    </div>
  );
};

export default SwapButton;
