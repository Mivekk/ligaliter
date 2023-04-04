import React from "react";

interface HeadingProps {
  children: React.ReactNode;
}

const Heading: React.FC<HeadingProps> = ({ children }) => {
  return (
    <div className="text-4xl font-semibold leading-[3rem] text-white">
      {children}
    </div>
  );
};

export default Heading;
