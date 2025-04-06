import React, { useEffect, useState } from "react";

// Input
interface InputProps {
  value: string | number;
  placeholder?: string;
  type?: string;
  name?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  validate?: "email";
  showError?: boolean;
  iconLeft?: React.ReactNode;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input: React.FC<InputProps> = ({
  value,
  placeholder = "Enter value...",
  type = "text",
  name,
  className = "",
  disabled = false,
  required = false,
  validate,
  showError = false,
  iconLeft = null,
  onChange,
}) => {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [emptyError, setEmptyError] = useState(false);

  useEffect(() => {
    // Tukšuma pārbaude
    if (required && showError) {
      setEmptyError(value === "" || value === null || value === undefined);
    }

    // Email validācija
    if (validate === "email" && typeof value === "string") {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      setIsValid(emailRegex.test(value));
    }
  }, [value, validate, required, showError]);

  const showEmailError = validate === "email" && showError && isValid === false;
  const showRequiredError = required && showError && emptyError;

  return (
    <div className="flex flex-col w-full gap-1">
      <div className="relative w-full">
        {iconLeft && (
          <span className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-400">
            {iconLeft}
          </span>
        )}

        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          required={required}
          onChange={onChange}
          className={`input ${iconLeft ? "!pl-12" : "pl-0"} ${className} ${
            showEmailError || showRequiredError ? "border-red-500" : ""
          }`}
        />
      </div>
      {showRequiredError && (
        <span className="text-red-500 text-sm">This field is required</span>
      )}
      {showEmailError && value && (
        <span className="text-red-500 text-sm">Invalid email address</span>
      )}
    </div>
  );
};

// Text area
interface TextAreaProps {
  name: string;
  rows: number;
  placeholder?: string;
  value: string;
  required?: boolean;
  showError?: boolean;
  minLength?: number;
  maxLength?: number;
  className?: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const TextArea: React.FC<TextAreaProps> = ({
  name = "message",
  rows = 6,
  placeholder = "Your message",
  value,
  required = false,
  showError = false,
  minLength,
  maxLength,
  className = "",
  onChange,
}) => {
  const [emptyError, setEmptyError] = useState(false);
  const [lengthError, setLengthError] = useState<string | null>(null);

  useEffect(() => {
    if (showError) {
      // Tukšuma pārbaude
      if (required) {
        setEmptyError(value === "" || value === null || value === undefined);
      }

      // Garuma pārbaude
      if (typeof value === "string") {
        if (minLength && value.length < minLength) {
          setLengthError(`Minimum ${minLength} characters required`);
        } else if (maxLength && value.length > maxLength) {
          setLengthError(`Maximum ${maxLength} characters allowed`);
        } else {
          setLengthError(null);
        }
      }
    }
  }, [value, required, minLength, maxLength, showError]);

  const showRequiredError = required && showError && emptyError;
  const showLengthError = showError && lengthError !== null;

  return (
    <div className="relative w-full flex flex-col gap-1">
      <textarea
        name={name}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`input w-full pr-10 pt-6 ${className} ${
          showRequiredError || showLengthError ? "border-red-500" : ""
        }`}
        maxLength={maxLength}
      />

      {/* Simbolu skaitītājs */}
      {typeof maxLength === "number" && (
        <span
          className={`absolute top-1.5 right-2 text-xs ${
            value.length / maxLength > 0.95
              ? "text-red-500"
              : value.length / maxLength > 0.8
              ? "text-yellow-500"
              : "text-gray-400"
          }`}
        >
          {value.length}/{maxLength}
        </span>
      )}

      {/* Kļūdu ziņojumi */}
      {showRequiredError && (
        <span className="text-red-500 text-sm">This field is required</span>
      )}
      {showLengthError && lengthError && value && (
        <span className="text-red-500 text-sm">{lengthError}</span>
      )}
    </div>
  );
};
