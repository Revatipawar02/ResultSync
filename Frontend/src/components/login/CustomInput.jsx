import React from "react";

const CustomInput = ({
  type = "text",
  placeholder,
  icon,
  rightIcon,
  value,
  onChange,
}) => {
  return (
    <div className="relative">
      {/* Left Icon */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
        {icon}
      </div>

      {/* Input */}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="
          w-full
          h-11
          sm:h-12
          pl-10
          pr-10
          rounded-xl
          border
          border-gray-300
          bg-white
          text-sm
          text-gray-800
          outline-none
          transition
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-200
        "
      />

      {/* Right Icon */}
      {rightIcon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer">
          {rightIcon}
        </div>
      )}
    </div>
  );
};

export default CustomInput;