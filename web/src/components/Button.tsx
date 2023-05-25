import React from "react";
import { motion } from "framer-motion";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled,
  type,
}) => {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`w-36 h-10 text-white mt-2 rounded-xl ${
        disabled ? "bg-stone-400" : "bg-utility"
      }`}
    >
      {children}
    </motion.button>
  );
};

export default Button;
