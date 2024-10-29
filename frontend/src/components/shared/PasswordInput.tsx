"use client";

import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface CustomPasswordInputProps {
  label?: string;
  placeHolder?: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  id?: string;
  value?: string;
}

export const CustomPasswordInput = ({
  label,
  placeHolder,
  onChange,
  disabled = false,
  error,
  helperText,
  id,
  value
}: CustomPasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='custom-text-input'>
      {label && (
        <label htmlFor={id} className={"" + (error ? "text-red-500" : "")}>
          {label}
        </label>
      )}

      <div
        className={
          "flex items-center rounded border pr-[3px] " +
          (error ? "border-red-500" : "border-[#d3dbe4]")
        }
      >
        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeHolder || ""}
          onChange={onChange}
          disabled={disabled}
          id={id}
          value={value}
        />
        <button
          type='button'
          onClick={() => setShowPassword(!showPassword)}
          className='transition-all hover:bg-[#eee] rounded-full p-[7px]'
        >
          {showPassword ? <FaEyeSlash size={17} /> : <FaEye size={17} />}
        </button>
      </div>

      {error && helperText && <span className='mt-2 text-sm text-red-500'>{helperText}</span>}
    </div>
  );
};
