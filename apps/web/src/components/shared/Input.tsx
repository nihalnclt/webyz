import React from "react";

interface InputProps {
  label?: string;
  placeHolder?: string;
  type?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  id?: string;
  value?: string;
}

export const Input = ({
  label,
  placeHolder,
  type = "text",
  onChange,
  disabled = false,
  error,
  helperText,
  id,
  value,
}: InputProps) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className={"block text-sm mb-1 " + (error ? "text-red-500" : "")}>
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeHolder || ""}
        onChange={onChange}
        disabled={disabled}
        id={id}
        className={
          "w-full form-input text-sm rounded-md  " +
          (error ? "" : "border-borderPrimary")
        }
        value={value}
      />

      {error && helperText && (
        <span className="mt-2 text-sm text-red-500">{helperText}</span>
      )}
    </div>
  );
};
