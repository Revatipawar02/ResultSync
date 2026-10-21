import React from "react";
import logo from "../../assets/images/toplogo.png";

const Toplogo = () => {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 w-full">
      {/* Logo */}
      <img
        src={logo}
        alt="ResultSync Logo"
        className="w-14 sm:w-20 lg:w-28 object-contain shrink-0"
      />

      {/* Text */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-none text-white">
          Result
          <span className="text-blue-400 [text-shadow:0_0_10px_#0061ff]">Sync</span>
        </h1>
        <p className="text-[10px] sm:text-xs lg:text-sm text-green-400">
          Student Result Management System
        </p>
      </div>
    </div>
  );
};

export default Toplogo;