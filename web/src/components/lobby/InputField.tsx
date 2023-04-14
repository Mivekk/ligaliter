import React, { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error: string | undefined;
};

const InputField: React.FC<InputFieldProps> = ({ error, ...props }) => {
  return (
    <div>
      <div>{props.label}</div>
      <input {...props} className="w-96 h-9 p-2" />
      <div className="text-red-600">{error}</div>
    </div>
  );
};

export default InputField;
