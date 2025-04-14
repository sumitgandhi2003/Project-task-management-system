import React, { useState } from "react";

const DropDownInput = ({ memberArr, onFocus, onClick }) => {
  const [showDropDown, setShowDropDown] = useState(false);
  return (
    <div className="relative">
      <Input
        className={`w-full border px-3 py-2 rounded transition-all duration-150 ${
          showDropDown ? "rounded-b-none" : ""
        }`}
        placeholder={"Enter Team Member Name"}
        onFocus={() => {
          setShowDropDown(true);
          onFocus();
        }}
        onBlur={() => setTimeout(() => setShowDropDown(false), 150)}
      />

      {showDropDown && (
        <ul
          className={`absolute bg-white shadow w-full rounded-md ${
            showDropDown
              ? "rounded-t-none border-2 border-gray-600 border-t-0"
              : ""
          }  min-h-40 max-h-72 overflow-y-scroll`}
        >
          {memberArr.map((item) => (
            <li
              key={item?._id}
              className="p-2 even:bg-gray-200 cursor-pointer"
              onClick={() => {
                if (!formData.team.find((member) => member._id === item._id)) {
                  setFormData((prev) => ({
                    ...prev,
                    team: [...prev.team, item],
                  }));
                }
              }}
            >
              {item?.name}
            </li>
          ))}
          {memberArr.length < 1 && (
            <div className="flex w-full min-h-full  absolute items-center justify-center">
              <BiLoaderAlt className="animate-spin h-10 w-10" />
            </div>
          )}
        </ul>
      )}
    </div>
  );
};

export default DropDownInput;
