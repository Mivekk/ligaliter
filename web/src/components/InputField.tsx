import React, { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

const InputField: React.FC<InputFieldProps> = (props) => {
  return (
    <div>
      <div>{props.label}</div>
      <input {...props} className="w-96 h-9 p-2" />
    </div>
  );
};

export default InputField;
