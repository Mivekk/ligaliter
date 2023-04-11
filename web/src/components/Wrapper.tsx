import React from "react";
import NavBar from "./Navbar";

interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return (
    <>
      <NavBar />
      <div className="flex w-full h-screen items-center justify-center bg-main">
        {children}
      </div>
    </>
  );
};

export default Wrapper;
