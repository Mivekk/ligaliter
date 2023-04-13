import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className={`w-36 h-10 bg-utility text-white mt-2 hover:opacity-75 rounded-xl ${
        props.disabled ? "bg-slate-400 hover:opacity-100" : "null"
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
