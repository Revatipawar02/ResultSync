import React from "react";
import LeftPanel from "../components/login/LeftPanel";
import Toplogo from "../components/login/Toplogo";
import AuthCard from "../components/login/AuthCard";
import rightBg from "../assets/images/right-bg.png";
import loginBg from "../assets/images/login-bg.png";

const Login = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Desktop Background */}
      <div
        className="hidden lg:block absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${rightBg})`,
        }}
      />

      {/* Mobile Background */}
      <div
        className="lg:hidden absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${loginBg})`,
        }}
      />

      {/* Main Layout */}
      <div className="relative z-10 flex min-h-screen">

        {/* Left Panel - Desktop Only */}
        <div className="hidden lg:block w-[55%] overflow-hidden rounded-r-[90px] shadow-2xl">
          <LeftPanel />
        </div>

        {/* Right Panel */}
        <div className="relative w-full lg:w-[45%] flex items-center justify-center">

          {/* Mobile Logo */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-full flex justify-center px-4 lg:hidden z-30">
            <div className="scale-110 origin-top">
              <Toplogo />
            </div>
          </div>

          {/* Auth Card */}
          <div className="flex w-full h-full items-center justify-center px-4 pt-20 pb-6 lg:px-10 lg:pt-0 lg:pb-0">
            <div className="w-full flex justify-center">
              <AuthCard />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;