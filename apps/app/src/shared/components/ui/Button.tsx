import classNames from "classnames";
import type { ButtonHTMLAttributes, FC, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "contained" | "outlined" | "text";
  color?: "primary" | "secondary";
  className?: string;
  children?: ReactNode;
}

const variantClasses = {
  contained: {
    primary: "bg-primary hover:bg-primary-hover text-white",
    secondary: "bg-secondary text-white",
  },
  outlined: {
    primary:
      "bg-transparent border border-primary text-primary hover:bg-primary hover:text-white",
    secondary:
      "bg-transparent border border-secondary text-secondary hover:bg-secondary hover:text-white",
  },
  text: {
    primary: "bg-transparent text-primary hover:bg-primary hover:text-white",
    secondary:
      "bg-transparent text-secondary hover:bg-secondary hover:text-white",
  },
};

export const Button: FC<ButtonProps> = ({
  variant = "contained",
  color = "primary",
  className,
  children,
  disabled,
  ...props
}) => {
  const combinedClassName = classNames(
    "transition-all rounded h-[40px] px-5 py-2 font-medium text-[15px] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-inherit disabled:hover:text-inherit flex items-center justify-center",
    variantClasses[variant][color],
    className,
  );

  return (
    <button className={combinedClassName} disabled={disabled} {...props}>
      {children}
    </button>
  );
};
