import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className={`w-36 h-10  text-white mt-2 rounded-xl ${
        props.disabled
          ? "bg-stone-400 hover:opacity-100"
          : "bg-utility hover:opacity-75"
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
