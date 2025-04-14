import React from "react";

const TextArea = ({
  name,
  placeholder,
  onChange,
  value,
  id,
  className,
  rows,
  cols,
}) => {
  return (
    <textarea
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      className={`${className} outline-none p-2 rounded-md border-2 font-roboto text-gray-900 bg-gray-100 border-gray-300 focus:border-gray-600 `}
      id={id}
      rows={rows}
      cols={cols}
    ></textarea>
  );
};
export default TextArea;
