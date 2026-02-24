import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, id, ...rest }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className={"block text-sm mb-1 " + (error ? "text-red-500" : "")}
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={id}
          className={
            "w-full form-input text-sm rounded-md border px-3 py-2 " +
            (error ? "border-red-500" : "border-borderPrimary")
          }
          {...rest}
        />

        {error && helperText && (
          <span className="mt-1 text-xs text-red-500">{helperText}</span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
