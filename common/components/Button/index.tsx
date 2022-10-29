import React from "react";

interface Props {}

const Button: React.FC<
  Props &
    React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >
> = ({ children, disabled, ...rest }) => {
  return (
    <button
      {...rest}
      disabled={disabled}
      className={`w-full rounded-8 h-48 flex items-center justify-center text-body font-semibold transition ${
        !!disabled
          ? "bg-gray-300 border border-outline-light text-disabled"
          : "text-white bg-primary hover:bg-primary-600 shadow-1.5"
      } ${rest.className || ""}`}
    >
      {children}
    </button>
  );
};

export default Button;
