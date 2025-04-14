import React from "react";

const Input = ({
  type = "text",
  placeholder,
  onChange,
  value,
  name,
  id,
  className,
  checked,
  required,
  multiple,
  accept,
  pattern,
  disabled,
  onFocus,
  maxLength,
  onKeyDown,
  onBlur,
  onSubmit,
  // Add any other props you need here
}) => {
  const defaultFunction = () => {};

  return (
    <input
      type={type}
      placeholder={placeholder}
      onChange={onChange || defaultFunction}
      value={value || ""}
      name={name}
      id={id}
      className={`${className} outline-none p-2 rounded-md border-2 font-roboto text-gray-900 bg-gray-100 border-gray-300 focus:border-gray-600 `}
      checked={checked}
      multiple={multiple}
      required={required}
      accept={accept}
      pattern={pattern}
      disabled={disabled}
      onFocus={onFocus}
      maxLength={maxLength}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      onSubmit={onSubmit || defaultFunction}
    />
  );
};

export default Input;
