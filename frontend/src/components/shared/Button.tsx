import classNames from "classnames";
import { ButtonHTMLAttributes, FC, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "contained" | "outlined" | "text";
  color?: "primary" | "secondary";
  className?: string;
  children?: ReactNode;
}

const variantClasses = {
  contained: {
    primary: "bg-accentPrimary text-white",
    secondary: "bg-accentSecondary text-white",
  },
  outlined: {
    primary:
      "bg-transparent border border-accentPrimary text-accentPrimary hover:bg-accentPrimary hover:text-white",
    secondary:
      "bg-transparent border border-accentSecondary text-accentSecondary hover:bg-accentSecondary hover:text-white",
  },
  text: {
    primary:
      "bg-transparent text-accentPrimary hover:bg-accentPrimary hover:text-white",
    secondary:
      "bg-transparent text-accentSecondary hover:bg-accentSecondary hover:text-white",
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
    "transition-all rounded h-[40px] px-5 py-2 font-medium text-[15px] disabled:cursor-not-allowed flex items-center justify-center",
    variantClasses[variant][color],
    className
  );

  return (
    <button
      className={combinedClassName}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
