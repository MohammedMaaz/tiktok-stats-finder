import React, { useCallback } from "react";

interface Props {
  prefix?: string;
  hint?: string;
  inputProps?: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
  value?: string;
  onValueChange?: (val: string) => void;
  error?: string;
}

const Input: React.FC<
  Props &
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >
> = ({
  prefix = "",
  hint = "",
  value = "",
  onValueChange,
  error,
  inputProps,
  ...rest
}) => {
  const onChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const newValue = e.target.value.slice(prefix?.length || 0);
      onValueChange?.(newValue);
    },
    [onValueChange]
  );

  const commonStyles =
    "outline-none absolute top-0 w-full h-full flex items-center px-24";

  return (
    <div
      {...rest}
      className={`w-full shadow-7.5 relative bg-white h-64 rounded-16 ${
        error ? "mb-32" : ""
      } ${rest.className || ""}`}
    >
      {value.length ? null : (
        <span
          className={`text-subheader text-disabled border border-transparent font-semibold ${commonStyles}`}
        >
          {prefix + hint}
        </span>
      )}

      <input
        type="text"
        autoComplete="off"
        {...(inputProps || {})}
        value={prefix + value}
        onChange={onChange}
        className={`text-subheader text-dark bg-transparent border font-semibold rounded-16 transition ${
          error
            ? "border-danger-500 focus:shadow-focus-danger"
            : "border-outline-light focus:shadow-focus-primary"
        } ${commonStyles} ${inputProps?.className || ""}`}
      />

      {error ? (
        <span className="absolute left-0 top-full mt-8 text-danger text-body font-semibold">
          {error}
        </span>
      ) : null}
    </div>
  );
};

export default Input;
