import React from "react";

interface InputProps {
  value: string | number;
  placeholder?: string;
  type?: string; // ļauj arī "password", "number" utt.
  name?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  value,
  placeholder = "Enter value...",
  type = "text",
  name,
  className = "",
  disabled = false,
  required = false,
  onChange,
}) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      disabled={disabled}
      required={required}
      onChange={onChange}
      className={`input ${className}`} // 'input' klase nāk no taviem globālajiem CSS mainīgajiem
    />
  );
};

export default Input;
