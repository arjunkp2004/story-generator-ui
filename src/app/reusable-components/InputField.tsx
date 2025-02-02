import React, { FC } from "react";

type InputFieldProps = {
  type?: "text" | "number" | "password";
  value: string | number;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onKeyDown?: (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
  multiline?: boolean;
};

const InputField: FC<InputFieldProps> = ({
  type = "text",
  value,
  onChange,
  onKeyDown,
  placeholder,
  multiline = false,
}) => {
  return multiline ? (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 input-black"
    />
  ) : (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 input-black"
    />
  );
};

export default InputField;
