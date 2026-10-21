import React, { useState } from "react";
import {
  UserCircle2,
  ChevronDown,
  LogOut,
  BarChart3,
} from "lucide-react";
import Toplogo from "../login/Toplogo";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="relative overflow-visible rounded-b-[35px] shadow-xl ">
      
      {/* Background */}
      <div className="absolute inset-0 rounded-b-[35px] bg-gradient-to-r from-[#0B1E6D] via-[#1D4ED8] to-[#5B21B6]" />

      {/* Glow Effects */}
      <div className="absolute -top-20 -left-10 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />

      <div className="absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />

      {/* Header Content */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="flex h-24 items-center justify-between ">

          {/* Left Section */}
          <div className="flex min-w-0 items-center gap-3 sm:gap-8">

            {/* Logo */}
            <div className="flex-shrink-0">
              <Toplogo />
            </div>

            {/* Dashboard Title */}
            <div className="hidden md:flex items-center gap-3 border-l border-white/20 pl-8">
              <BarChart3 size={28} className="text-white" />

              <h1 className="text-xl lg:text-2xl font-bold text-white">
                Faculty Dashboard
              </h1>
            </div>

          </div>

          {/* Profile */}
          <div className="relative flex-shrink-0">

            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 sm:gap-3 rounded-2xl border border-white/20 bg-white/10 px-2 sm:px-4 py-2 backdrop-blur-xl transition hover:bg-white/20"
            >
              {/* Profile Icon */}
              <UserCircle2
                size={42}
                className="text-white"
              />

              {/* Desktop Profile Details */}
              <div className="hidden sm:block text-left px-1">
                <h3 className="font-semibold text-white">
                  Admin 
                </h3>

                <p className="text-sm text-blue-100">
                  Faculty
                </p>
              </div>

              {/* Arrow */}
              <ChevronDown
                size={18}
                className={`text-white transition-transform duration-300 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Logout Dropdown */}
            {open && (
              <div className="absolute right-0 top-full z-50 mt-3 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-3 text-red-600 transition hover:bg-red-50 hover:cursor-pointer"
                >
                  <LogOut size={18} />
                  Logout
                </button>

              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;