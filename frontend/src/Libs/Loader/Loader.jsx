import React, { useEffect } from "react";
import "./Loader.css";

export const Loader = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  });
  return (
    <div
      className={` h-screen w-full flex justify-center items-center transition-all duration-300 
       "bg-gray-200"
      `}
    >
      <div className="loader">
        <div className="loading"></div>
      </div>
    </div>
  );
};

export default Loader;
