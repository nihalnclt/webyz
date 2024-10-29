import { ReactNode } from "react";

interface CustomSelectProps {
  label?: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  id?: string;
  value?: string;
  children?: ReactNode;
}

export const CustomSelect = ({
  label,
  onChange,
  disabled,
  error,
  helperText,
  id,
  value,
  children,
}: CustomSelectProps) => {
  return (
    <div className="custom-select">
      {label && (
        <label htmlFor={id} className={"" + (error ? "text-red-500" : "")}>
          {label}
        </label>
      )}
      <select
        id={id}
        onChange={onChange}
        disabled={disabled}
        className={"border " + (error ? "border-red-500" : "border-[#d3dbe4]")}
        value={value}
      >
        {children}
      </select>
      {error && helperText && <span className="mt-2 text-sm text-red-500">{helperText}</span>}
    </div>
  );
};