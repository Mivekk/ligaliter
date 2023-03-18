import Link from "next/link";
import React from "react";

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = () => {
  return (
    <div className="flex flex-row items-center justify-between px-4 w-full h-14 bg-lime-400">
      <Link href={"/"} className="hover:opacity-75">
        home
      </Link>
      <div className="flex gap-4">
        <Link href={"/login"} className="hover:opacity-75">
          login
        </Link>
        <Link href={"/register"} className="hover:opacity-75">
          register
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
