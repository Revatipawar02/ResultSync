import React, { useState } from "react";
import logo from "../../assets/images/logo.png";

import {
  User,
  Lock,
  Eye,
  ArrowRight,
  GraduationCap,
  Hash,
  BookOpen,
  Mail,
} from "lucide-react";

import CustomInput from "./CustomInput";
import { registerStudent } from "../../API/StudentApi";

const RegisterForm = ({ onLogin }) => {
  // Form data
  const [name, setName] = useState("");
  const [prnNumber, setPrnNumber] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Loading and message
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle Registration
  const handleRegister = async () => {
    // Basic validation
    if (
      !name ||
      !prnNumber ||
      !rollNumber ||
      !studentClass ||
      !email ||
      !password
    ) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const studentData = {
        name,
        email,
        password,
        prnNumber,
        rollNumber,
        studentClass,
      };

      await registerStudent(studentData);

      setMessage("Registration successful! Please login.");

      // Clear form
      setName("");
      setPrnNumber("");
      setRollNumber("");
      setStudentClass("");
      setEmail("");
      setPassword("");

      // Go to Login after 1.5 seconds
      setTimeout(() => {
        onLogin();
      }, 1500);

    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        w-full
        max-w-[500px]
        h-auto
        lg:h-[650px]
        rounded-[28px]
        bg-white/95
        backdrop-blur-md
        shadow-2xl
        border
        border-gray-200
        px-4
        py-4
        sm:px-6
        sm:py-5
        lg:px-8
        lg:py-6
        mx-1
      "
    >
      {/* Logo */}
      <div className="flex justify-center mb-1">
        <img
          src={logo}
          alt="ResultSync Logo"
          className="w-55 sm:w-55 object-contain"
        />
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center shrink-0">
          <GraduationCap
            className="text-green-600"
            size={21}
          />
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Create Account
          </h3>

          <p className="text-xs sm:text-sm text-gray-500">
            Register to access your dashboard
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-2">

        {/* Student Name + PRN */}
        <div className="grid grid-cols-2 gap-2">

          <CustomInput
            type="text"
            placeholder="Student Name"
            icon={<User size={17} />}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <CustomInput
            type="text"
            placeholder="PRN Number"
            icon={<GraduationCap size={17} />}
            value={prnNumber}
            onChange={(e) => setPrnNumber(e.target.value)}
          />

        </div>

        {/* Roll No + Class */}
        <div className="grid grid-cols-2 gap-2">

          <CustomInput
            type="text"
            placeholder="Roll No"
            icon={<Hash size={17} />}
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
          />

          <div className="relative">

            <BookOpen
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />

            <select
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
              className="
                w-full
                h-11
                sm:h-12
                pl-10
                pr-2
                rounded-xl
                border
                border-gray-300
                bg-white
                text-sm
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-200
              "
            >
              <option value="">Class</option>
              <option>FY B.Sc</option>
              <option>SY B.Sc</option>
              <option>TY B.Sc</option>
              <option>MCA-I</option>
              <option>MCA-II</option>
            </select>

          </div>

        </div>

        {/* Email */}
        <CustomInput
          type="email"
          placeholder="Email"
          icon={<Mail size={18} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <CustomInput
          type="password"
          placeholder="Password"
          icon={<Lock size={18} />}
          rightIcon={<Eye size={18} />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

      </div>

      {/* Message */}
      {message && (
        <p
          className={`mt-3 text-center text-sm font-medium ${
            message.includes("successful")
              ? "text-green-600"
              : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}

      {/* Register Button */}
      <button
        type="button"
        onClick={handleRegister}
        disabled={loading}
        className="
          hover:cursor-pointer
          mt-4
          w-full
          h-11
          sm:h-12
          rounded-xl
          bg-gradient-to-r
          from-blue-600
          to-purple-600
          text-white
          font-semibold
          flex
          items-center
          justify-center
          gap-2
          hover:scale-[1.01]
          active:scale-[0.98]
          transition-all
          duration-300
          disabled:opacity-70
          disabled:cursor-not-allowed
        "
      >
        {loading ? "Registering..." : "Register"}

        {!loading && <ArrowRight size={20} />}
      </button>

      {/* Divider */}
      <div className="flex mt-4 items-center gap-3 my-3">
        <hr className="flex-1 border-gray-300" />

        <span className="text-xs text-gray-500 whitespace-nowrap">
          Already have an account?
        </span>

        <hr className="flex-1 border-gray-300" />
      </div>

      {/* Footer */}
      <p className="text-center text-sm text-gray-500">
        Back to

        <button
          type="button"
          onClick={onLogin}
          className="ml-2 text-blue-600 font-semibold hover:underline"
        >
          Login
        </button>
      </p>

    </div>
  );
};

export default RegisterForm;