import React from "react";
import Login from "./pages/Login";
import StudentPage from "./pages/StudentPage";
import { Routes, Route, Navigate } from "react-router-dom";
import StudentProfileCard from "./components/studentdashboard/StudentProfilleCard";
import FacultyPage from "./pages/FacultyPage";

const App = () => {
  return (
    <Routes>

      {/* Login Page */}
      <Route
        path="/"
        element={<Login />}
      />

      {/* Student Dashboard */}
      <Route
        path="/student/dashboard"
        element={<StudentPage />}
      />

      {/* Student Profile */}
      <Route path="/student/profile" element={<StudentProfileCard />}/>

      {/* faculty dashboard */}
      <Route path="/faculty/dashboard" element={<FacultyPage/>} />

      {/* Wrong URL → Login */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    // </Routes>
   
  );
};

export default App;