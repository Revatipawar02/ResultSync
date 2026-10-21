import React, { useState } from "react";
import logo from "../../assets/images/logo.png";

import {
  User,
  Lock,
  Eye,
  ArrowRight,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";

import CustomInput from "./CustomInput";
import { useNavigate } from "react-router-dom";

import { loginStudent } from "../../API/StudentApi";
import { facultyLogin } from "../../API/FacultyApi";


const LoginForm = ({ onRegister }) => {

  const navigate = useNavigate();

  // ==========================================
  // LOGIN TYPE
  // ==========================================

  const [loginType, setLoginType] = useState("student");

  // ==========================================
  // FORM DATA
  // ==========================================

  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");

  // ==========================================
  // UI STATE
  // ==========================================

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const isStudent = loginType === "student";


  // ==========================================
  // CHANGE LOGIN TYPE
  // ==========================================

  const handleLoginTypeChange = (type) => {

    setLoginType(type);

    setMessage("");

    setLoginValue("");

    setPassword("");
  };


  // ==========================================
  // LOGIN
  // ==========================================

  const handleLogin = async () => {

    // ------------------------------------------
    // VALIDATION
    // ------------------------------------------

    if (
      !loginValue.trim() ||
      !password.trim()
    ) {

      setMessage(
        isStudent
          ? "Please enter Email or PRN Number and Password."
          : "Please enter Faculty Email and Password."
      );

      return;
    }


    try {

      setLoading(true);

      setMessage("");


      // ========================================
      // STUDENT LOGIN
      // ========================================

      if (isStudent) {

        const student = await loginStudent(
          loginValue.trim(),
          password
        );


        // ----------------------------------------
        // SAVE STUDENT LOGIN DATA
        // ----------------------------------------

        localStorage.setItem(
          "studentId",
          student.id
        );

        localStorage.setItem(
          "role",
          "student"
        );

        localStorage.setItem(
          "token",
          "student-login"
        );


        // ----------------------------------------
        // STUDENT DASHBOARD
        // ----------------------------------------

        navigate("/student/dashboard");

        return;
      }


      // ========================================
      // FACULTY LOGIN
      // ========================================

      const faculty = await facultyLogin(
        loginValue.trim(),
        password
      );


      // ----------------------------------------
      // CHECK RESPONSE
      // ----------------------------------------

      if (
        !faculty ||
        faculty.success !== true
      ) {

        throw new Error(
          faculty?.message ||
          "Faculty login failed"
        );
      }


      // ========================================
      // SAVE FACULTY LOGIN DATA
      // ========================================

      localStorage.setItem(
        "facultyId",
        faculty.facultyId
      );

      localStorage.setItem(
        "facultyName",
        faculty.name
      );

      localStorage.setItem(
        "facultyEmail",
        faculty.email
      );

      localStorage.setItem(
        "facultyDepartment",
        faculty.department || ""
      );

      localStorage.setItem(
        "role",
        "faculty"
      );

      localStorage.setItem(
        "token",
        "faculty-login"
      );


      // ========================================
      // FACULTY DASHBOARD
      // ========================================

      navigate("/faculty/dashboard");


    } catch (error) {

      console.error(
        "Login Error:",
        error
      );


      // ----------------------------------------
      // ERROR MESSAGE
      // ----------------------------------------

      if (isStudent) {

        setMessage(
          "Invalid Email/PRN or Password"
        );

      } else {

        setMessage(
          error.message ||
          "Invalid Faculty Email or Password"
        );
      }


    } finally {

      setLoading(false);
    }
  };


  // ==========================================
  // UI
  // ==========================================

  return (
    <div
      className="
        w-full
        max-w-[450px]
        h-auto
        lg:h-[650px]
        rounded-[30px]
        bg-white/95
        backdrop-blur-md
        shadow-2xl
        border
        border-gray-200
        px-5
        py-5
        sm:px-8
        sm:py-6
        lg:px-10
        lg:py-4
        mx-1
        flex
        flex-col
      "
    >

      {/* ======================================
          LOGO
      ======================================= */}

      <div className="flex justify-center mb-1">

        <img
          src={logo}
          alt="ResultSync Logo"
          className="
            w-55
            sm:w-55
            lg:w-64
            object-contain
          "
        />

      </div>


      {/* ======================================
          LOGIN TYPE
      ======================================= */}

      <div
        className="
          relative
          flex
          bg-gray-100
          rounded-xl
          p-1
          mb-4
        "
      >

        {/* Slider */}

        <div
          className={`
            absolute
            top-1
            bottom-1
            w-[calc(50%-4px)]
            rounded-lg
            bg-white
            shadow-sm
            transition-all
            duration-300
            ease-in-out
            ${isStudent ? "left-1" : "left-1/2"}
          `}
        />


        {/* ====================================
            STUDENT
        ===================================== */}

        <button
          type="button"
          onClick={() =>
            handleLoginTypeChange("student")
          }
          className={`
            relative
            z-10
            flex-1
            flex
            items-center
            justify-center
            gap-2
            py-2.5
            rounded-lg
            text-sm
            font-semibold
            transition-colors
            duration-300
            ${
              isStudent
                ? "text-blue-600"
                : "text-gray-500"
            }
          `}
        >

          <GraduationCap size={18} />

          Student

        </button>


        {/* ====================================
            FACULTY
        ===================================== */}

        <button
          type="button"
          onClick={() =>
            handleLoginTypeChange("faculty")
          }
          className={`
            relative
            z-10
            flex-1
            flex
            items-center
            justify-center
            gap-2
            py-2.5
            rounded-lg
            text-sm
            font-semibold
            transition-colors
            duration-300
            ${
              !isStudent
                ? "text-blue-600"
                : "text-gray-500"
            }
          `}
        >

          <ShieldCheck size={18} />

          Faculty

        </button>

      </div>


      {/* ======================================
          WELCOME SECTION
      ======================================= */}

      <div
        className="
          flex
          items-center
          gap-3
          sm:gap-4
        "
      >

        <div
          className="
            w-12
            h-12
            sm:w-14
            sm:h-14
            rounded-full
            bg-blue-200
            flex
            items-center
            justify-center
            shrink-0
          "
        >

          {isStudent ? (

            <GraduationCap
              className="text-blue-600"
              size={22}
            />

          ) : (

            <ShieldCheck
              className="text-blue-600"
              size={22}
            />

          )}

        </div>


        <div>

          <h3
            className="
              text-base
              sm:text-xl
              font-bold
              text-slate-900
            "
          >
            {isStudent
              ? "Welcome Back!"
              : "Faculty Login"}
          </h3>


          <p
            className="
              text-xs
              sm:text-sm
              text-gray-500
            "
          >
            {isStudent
              ? "Login to access your student dashboard"
              : "Login to access your faculty dashboard"}
          </p>

        </div>

      </div>


      {/* ======================================
          FORM
      ======================================= */}

      <div
        className="
          mt-4
          sm:mt-5
          space-y-3
          sm:space-y-4
        "
      >

        {/* ====================================
            EMAIL / PRN
        ===================================== */}

        <CustomInput
          type="text"
          placeholder={
            isStudent
              ? "Email or PRN Number"
              : "Faculty Email"
          }
          icon={<User size={20} />}
          value={loginValue}
          onChange={(e) => {

            setLoginValue(
              e.target.value
            );

            setMessage("");
          }}
        />


        {/* ====================================
            PASSWORD
        ===================================== */}

        <CustomInput
          type="password"
          placeholder="Password"
          icon={<Lock size={20} />}
          rightIcon={<Eye size={20} />}
          value={password}
          onChange={(e) => {

            setPassword(
              e.target.value
            );

            setMessage("");
          }}
        />

      </div>


      {/* ======================================
          ERROR MESSAGE
      ======================================= */}

      {message && (

        <p
          className="
            mt-3
            text-center
            text-sm
            font-medium
            text-red-500
          "
        >
          {message}
        </p>

      )}


      {/* ======================================
          REMEMBER ME
      ======================================= */}

      <div
        className="
          mt-2
          flex
          justify-between
          items-center
          text-sm
        "
      >

        <label
          className="
            flex
            items-center
            gap-2
            text-gray-600
          "
        >

          <input
            type="checkbox"
            className="
              w-4
              h-4
              accent-blue-600
            "
          />

          Remember me

        </label>


        <button
          type="button"
          className="
            text-blue-600
            font-medium
            hover:underline
          "
        >
          Forgot Password?
        </button>

      </div>


      {/* ======================================
          LOGIN BUTTON
      ======================================= */}

      <button
        type="button"
        onClick={handleLogin}
        disabled={loading}
        className="
          hover:cursor-pointer
          mt-4
          sm:mt-5
          w-full
          h-11
          py-1.5
          sm:h-12
          rounded-xl
          bg-gradient-to-r
          from-blue-600
          to-purple-600
          text-white
          text-base
          sm:text-lg
          font-semibold
          flex
          items-center
          justify-center
          gap-3
          hover:scale-[1.02]
          active:scale-[0.98]
          transition
          duration-300
          shadow-lg
          disabled:opacity-60
          disabled:cursor-not-allowed
        "
      >

        {loading
          ? "Logging in..."
          : `Login as ${
              isStudent
                ? "Student"
                : "Faculty"
            }`}


        {!loading && (
          <ArrowRight size={20} />
        )}

      </button>


      {/* ======================================
          BOTTOM SECTION
      ======================================= */}

      <div className="mt-3 min-h-[55px]">

        {isStudent ? (

          <>

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <hr
                className="
                  flex-1
                  border-gray-400
                "
              />


              <span
                className="
                  text-gray-500
                  text-xs
                  sm:text-sm
                  whitespace-nowrap
                "
              >
                or continue with
              </span>


              <hr
                className="
                  flex-1
                  border-gray-400
                "
              />

            </div>


            <p
              className="
                text-center
                text-sm
                text-gray-500
                mt-3
              "
            >

              New here?

              <button
                type="button"
                onClick={onRegister}
                className="
                  ml-2
                  text-blue-600
                  font-medium
                  hover:underline
                "
              >
                Register
              </button>

            </p>

          </>

        ) : (

          <>

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <div
                className="
                  h-px
                  flex-1
                  bg-gray-400
                "
              />


              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-blue-600
                  whitespace-nowrap
                "
              >

                <ShieldCheck size={17} />

                <span
                  className="
                    text-xs
                    sm:text-sm
                    font-semibold
                  "
                >
                  Secure Faculty Access
                </span>

              </div>


              <div
                className="
                  h-px
                  flex-1
                  bg-gray-400
                "
              />

            </div>


            <p
              className="
                text-center
                text-xs
                sm:text-sm
                text-gray-500
                mt-3
              "
            >
              Manage student results securely
            </p>

          </>

        )}

      </div>

    </div>
  );
};

export default LoginForm;