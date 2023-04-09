import React from "react";
import Heading from "./Heading";

interface PopupProps {
  text: string;
  result: boolean;
}

const Popup: React.FC<PopupProps> = ({ text, result }) => {
  return (
    <div className="absolute top-[10%] left-[50%] w-[30rem] h-[10rem] translate-x-[-50%] bg-plt-two border border-white rounded-md">
      <div className="ml-3">
        <Heading>Popup</Heading>
      </div>
      <div className="m-2 text-white">{text}</div>
      <button>Cancel</button>
      <button>Accept</button>
    </div>
  );
};

export default Popup;
