import React from "react";

interface SkipButtonProps {}

const SkipButton: React.FC<SkipButtonProps> = () => {
  const handleOnClick = () => {
    console.log("skip");
  };

  return (
    <div
      onClick={handleOnClick}
      className={`flex flex-col items-center text-white text-2xl 
        justify-center select-none w-40 h-10 bg-gray-400`}
    >
      <div>SKIP</div>
    </div>
  );
};

export default SkipButton;
