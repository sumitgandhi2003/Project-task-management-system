import React from "react";

const Select = ({
  name = "",
  id,
  className,
  onChange,
  value,
  itemArray,
  displayName,
  disabled,
  onFocus,
}) => {
  const themeClass =
    "text-gray-900 bg-gray-100 border-gray-300 focus:border-gray-600";
  const sortedItemArray = itemArray?.sort((a, b) =>
    a.value.localeCompare(b.value)
  );
  const defaultFunction = () => {
    return;
  };

  return (
    <select
      name={name}
      id={id}
      className={`${className} ${themeClass} outline-none transition-all duration-300`}
      onChange={onChange || defaultFunction}
      value={value}
      disabled={disabled}
      onFocus={onFocus || defaultFunction}
    >
      {displayName && <option value="">{displayName}</option>}

      {sortedItemArray?.map((item) => {
        return (
          <option
            key={item?.id}
            value={item?.value?.toLowerCase()}
            className={`even:bg-gray-50 border-b-2`}
          >
            {item.name}
          </option>
        );
      })}
    </select>
  );
};

export default Select;
