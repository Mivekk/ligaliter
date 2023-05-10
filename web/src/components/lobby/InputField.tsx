import React, { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error: string | undefined;
};

const InputField: React.FC<InputFieldProps> = ({ error, ...props }) => {
  return (
    <div>
      <div>{props.label}</div>
      <input {...props} className="sm:w-[24rem] w-[20.5rem] h-9 p-2" />
      <div className="text-red-600">{error}</div>
    </div>
  );
};

export default InputField;
