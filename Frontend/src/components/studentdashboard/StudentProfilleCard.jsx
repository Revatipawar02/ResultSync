import React, { useEffect, useState } from "react";
import {
  UserCircle2,
  GraduationCap,
  Hash,
  School,
  Mail,
  ArrowLeft,
  Pencil,
  Save,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import {
  getStudentProfile,
  updateStudentProfile,
} from "../../API/StudentApi";

const StudentProfileCard = ({ setShowProfile }) => {
  const navigate = useNavigate();

  // =========================
  // STATES
  // =========================
  const [student, setStudent] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    prnNumber: "",
    rollNumber: "",
    studentClass: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================
  // LOAD PROFILE
  // =========================
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const studentId = localStorage.getItem("studentId");

        if (!studentId) {
          setError("Student session not found. Please login again.");
          return;
        }

        const data = await getStudentProfile(studentId);

        setStudent(data);

        setFormData({
          name: data.name || "",
          email: data.email || "",
          prnNumber: data.prnNumber || "",
          rollNumber: data.rollNumber || "",
          studentClass: data.studentClass || "",
        });

      } catch (error) {
        console.error("Profile loading error:", error);

        setError(
          error.message || "Unable to load student profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // EDIT PROFILE
  // =========================
  const handleEdit = () => {
    setMessage("");
    setError("");

    setFormData({
      name: student?.name || "",
      email: student?.email || "",
      prnNumber: student?.prnNumber || "",
      rollNumber: student?.rollNumber || "",
      studentClass: student?.studentClass || "",
    });

    setEditing(true);
  };

  // =========================
  // CANCEL EDIT
  // =========================
  const handleCancel = () => {
    setFormData({
      name: student?.name || "",
      email: student?.email || "",
      prnNumber: student?.prnNumber || "",
      rollNumber: student?.rollNumber || "",
      studentClass: student?.studentClass || "",
    });

    setMessage("");
    setError("");
    setEditing(false);
  };

  // =========================
  // SAVE PROFILE
  // =========================
  const handleSave = async () => {
    // Validation
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.prnNumber.trim() ||
      !formData.rollNumber.trim() ||
      !formData.studentClass.trim()
    ) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const studentId = localStorage.getItem("studentId");

      if (!studentId) {
        setError("Student session not found. Please login again.");
        return;
      }

      const updatedStudent = await updateStudentProfile(
        studentId,
        formData
      );

      // Update displayed profile
      setStudent(updatedStudent);

      // Update form
      setFormData({
        name: updatedStudent.name || "",
        email: updatedStudent.email || "",
        prnNumber: updatedStudent.prnNumber || "",
        rollNumber: updatedStudent.rollNumber || "",
        studentClass: updatedStudent.studentClass || "",
      });

      setEditing(false);

      setMessage("Profile updated successfully.");

    } catch (error) {
      console.error("Profile update error:", error);

      setError(
        error.message || "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // BACK TO DASHBOARD
  // =========================
  const backPage = () => {
    navigate("/student/dashboard");

    if (setShowProfile) {
      setShowProfile(false);
    }
  };

  // =========================
  // LOADING UI
  // =========================
  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-200">
        <div className="flex justify-center items-center py-10">
          <p className="text-gray-500 font-medium">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR UI
  // =========================
  if (error && !student) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-200">

        <p className="text-center text-red-500 font-medium">
          {error}
        </p>

        <button
          type="button"
          onClick={backPage}
          className="mt-5 w-full py-3 rounded-xl bg-blue-600 text-white font-semibold"
        >
          Back to Dashboard
        </button>

      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-200 relative">

      {/* =========================
          MOBILE BACK
      ========================= */}
      <button
        type="button"
        onClick={backPage}
        className="absolute left-6 top-6 lg:hidden flex items-center gap-2 text-blue-500 font-semibold active:scale-95 cursor-pointer"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      {/* =========================
          PROFILE HEADER
      ========================= */}
      <div className="flex flex-col items-center">

        <UserCircle2
          size={90}
          className="text-blue-600"
        />

        {!editing ? (
          <>
            <h2 className="mt-3 text-2xl font-bold text-gray-800">
              {student?.name}
            </h2>

            <p className="text-gray-500">
              {student?.studentClass} Student
            </p>
          </>
        ) : (
          <>
            <h2 className="mt-3 text-xl font-bold text-gray-800">
              Edit Profile
            </h2>

            <p className="text-gray-500 text-sm">
              Update your student information
            </p>
          </>
        )}

      </div>

      <hr className="my-6" />

      {/* =========================
          MESSAGE
      ========================= */}
      {message && (
        <div className="mb-4 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-center text-sm font-medium text-green-600">
          {message}
        </div>
      )}

      {error && student && (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-center text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {/* =========================
          EDIT FORM
      ========================= */}
      {editing ? (
        <div className="space-y-4">

          {/* Name */}
          <div>
            <label className="block mb-1 text-xs font-semibold text-gray-500">
              Student Name
            </label>

            <div className="relative">
              <UserCircle2
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600"
              />

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* PRN */}
          <div>
            <label className="block mb-1 text-xs font-semibold text-gray-500">
              PRN Number
            </label>

            <div className="relative">
              <GraduationCap
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600"
              />

              <input
                type="text"
                name="prnNumber"
                value={formData.prnNumber}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Roll Number */}
          <div>
            <label className="block mb-1 text-xs font-semibold text-gray-500">
              Roll Number
            </label>

            <div className="relative">
              <Hash
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600"
              />

              <input
                type="text"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Class */}
          <div>
            <label className="block mb-1 text-xs font-semibold text-gray-500">
              Class
            </label>

            <div className="relative">
              <School
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600"
              />

              <select
                name="studentClass"
                value={formData.studentClass}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select Class</option>
                <option>FY B.Sc</option>
                <option>SY B.Sc</option>
                <option>TY B.Sc</option>
                <option>MCA-I</option>
                <option>MCA-II</option>
              </select>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-xs font-semibold text-gray-500">
              Email
            </label>

            <div className="relative">
              <Mail
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Save + Cancel */}
          <div className="grid grid-cols-2 gap-3 pt-3">

            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-60"
            >
              <X size={19} />
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3 font-semibold text-white shadow-md transition hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Save size={19} />

              {saving ? "Saving..." : "Save Changes"}
            </button>

          </div>

        </div>
      ) : (

        /* =========================
           NORMAL PROFILE
        ========================= */
        <div className="space-y-5">

          {/* PRN */}
          <div className="flex gap-3">
            <GraduationCap
              size={22}
              className="text-blue-600 shrink-0"
            />

            <div>
              <p className="text-xs text-gray-500">
                PRN Number
              </p>

              <p className="font-semibold text-gray-800">
                {student?.prnNumber}
              </p>
            </div>
          </div>

          {/* Roll Number */}
          <div className="flex gap-3">
            <Hash
              size={22}
              className="text-blue-600 shrink-0"
            />

            <div>
              <p className="text-xs text-gray-500">
                Roll Number
              </p>

              <p className="font-semibold text-gray-800">
                {student?.rollNumber}
              </p>
            </div>
          </div>

          {/* Class */}
          <div className="flex gap-3">
            <School
              size={22}
              className="text-blue-600 shrink-0"
            />

            <div>
              <p className="text-xs text-gray-500">
                Class
              </p>

              <p className="font-semibold text-gray-800">
                {student?.studentClass}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex gap-3">
            <Mail
              size={22}
              className="text-blue-600 shrink-0"
            />

            <div className="min-w-0">
              <p className="text-xs text-gray-500">
                Email
              </p>

              <p className="font-semibold text-gray-800 break-all">
                {student?.email}
              </p>
            </div>
          </div>

        </div>
      )}

      {/* =========================
          EDIT BUTTON
      ========================= */}
      {!editing && (
        <button
          type="button"
          onClick={handleEdit}
          className="mt-8 w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer"
        >
          <Pencil size={19} />
          Edit Profile
        </button>
      )}

    </div>
  );
};

export default StudentProfileCard;