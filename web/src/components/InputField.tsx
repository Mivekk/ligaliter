import React, { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

const InputField: React.FC<InputFieldProps> = (props) => {
  return (
    <div>
      <div>{props.label}</div>
      <input {...props} className="w-96 h-9 border border-black" />
    </div>
  );
};

export default InputField;
