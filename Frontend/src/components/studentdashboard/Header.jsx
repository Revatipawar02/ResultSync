import React, { useEffect, useState } from "react";
import {
  UserCircle2,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import Toplogo from "../login/Toplogo";
import { getStudentProfile } from "../../API/StudentApi";

const Header = ({ setShowProfile }) => {
  const [open, setOpen] = useState(false);
  const [student, setStudent] = useState(null);

  const navigate = useNavigate();

  // =========================
  // GET LOGGED-IN STUDENT DATA
  // =========================
  useEffect(() => {
    const loadStudentData = async () => {
      try {
        const studentId = localStorage.getItem("studentId");

        if (!studentId) {
          return;
        }

        const data = await getStudentProfile(studentId);

        setStudent(data);
      } catch (error) {
        console.error("Failed to load student data:", error);
      }
    };

    loadStudentData();
  }, []);

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("studentId");

    setOpen(false);

    navigate("/");
  };

  // =========================
  // PROFILE
  // =========================
  const handleProfile = () => {
    setShowProfile(true);
    setOpen(false);
  };

  return (
    <header className="relative overflow-visible rounded-b-[35px] shadow-2xl">

      {/* Background */}
      <div className="absolute inset-0 rounded-b-[35px] bg-gradient-to-r from-[#0B1E6D] via-[#1D4ED8] to-[#5B21B6]" />

      {/* Glow */}
      <div className="absolute -top-24 -left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl" />

      <div className="absolute -bottom-20 right-0 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-20 mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">

        <div className="flex h-24 items-center justify-between">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Toplogo />
          </div>

          {/* Profile */}
          <div className="relative flex-shrink-0">

            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-xl hover:bg-white/20 transition"
            >

              {/* Profile Icon */}
              <UserCircle2
                size={42}
                className="text-white"
              />

              {/* Student Information */}
              <div className="hidden sm:block text-left">

                <h3 className="font-semibold text-white">
                  {student?.name || "Student"}
                </h3>

                <p className="text-sm text-blue-100">
                  Student
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

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 top-full mt-3 w-48 rounded-xl bg-white shadow-2xl border border-gray-200 overflow-hidden z-[100]">

                {/* Profile - Mobile Only */}
                <button
                  type="button"
                  onClick={handleProfile}
                  className="w-full lg:hidden flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
                >
                  <User size={18} />
                  Profile
                </button>

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition"
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