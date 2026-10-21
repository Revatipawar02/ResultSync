import React, { useState } from "react";
import {
  Upload,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";

const UploadResultCard = () => {
  const [studentClass, setStudentClass] = useState("");
  const [semester, setSemester] = useState("");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // FILE SELECT
  // ==========================================

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    setMessage("");
    setError("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    // Check PDF
    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Please select a PDF file.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  // ==========================================
  // UPLOAD RESULT
  // ==========================================

  const handleUpload = async () => {
    setMessage("");
    setError("");

    // Validate class
    if (!studentClass) {
      setError("Please select your class.");
      return;
    }

    // Validate semester
    if (!semester) {
      setError("Please select a semester.");
      return;
    }

    // Validate file
    if (!file) {
      setError("Please select a result PDF.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      // IMPORTANT:
      // These names must match @RequestParam
      // in StudentResultController.java

      formData.append("file", file);
      formData.append("studentClass", studentClass);
      formData.append("semester", semester);

      console.log("================================");
      console.log("Uploading Result");
      console.log("File:", file.name);
      console.log("Class:", studentClass);
      console.log("Semester:", semester);
      console.log("================================");

      const response = await fetch(
        "http://localhost:8080/api/results/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const responseText = await response.text();

      console.log("Response Status:", response.status);
      console.log("Backend Response:", responseText);

      if (!response.ok) {
        throw new Error(
          responseText ||
            `Upload failed. Status: ${response.status}`
        );
      }

      // Try converting JSON response
      let resultData;

      try {
        resultData = JSON.parse(responseText);
      } catch {
        resultData = responseText;
      }

      console.log("Saved Result:", resultData);

      // Success message
      setMessage("Result uploaded successfully!");

      // Clear form
      setFile(null);
      setStudentClass("");
      setSemester("");

      // Clear file input
      const fileInput =
        document.getElementById("resultPdf");

      if (fileInput) {
        fileInput.value = "";
      }

    } catch (err) {
      console.error("Upload Error:", err);

      setError(
        err.message || "Failed to upload result."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">

      {/* ==========================================
          TITLE
      ========================================== */}

      <div className="flex items-center gap-3 mb-6">

        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
          <Upload
            className="text-blue-600"
            size={24}
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Upload Result
          </h2>

          <p className="text-gray-500 text-sm">
            Upload your semester result in PDF format.
          </p>
        </div>

      </div>

      {/* ==========================================
          CLASS + SEMESTER
      ========================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* CLASS */}

        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Class
          </label>

          <select
            value={studentClass}
            onChange={(e) => {
              setStudentClass(e.target.value);
              setMessage("");
              setError("");
            }}
            className="w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >

            <option value="">
              Select Class
            </option>

            <option value="MCA-I">
              MCA-I
            </option>

            <option value="MCA-II">
              MCA-II
            </option>

          </select>

        </div>

        {/* SEMESTER */}

        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Semester
          </label>

          <select
            value={semester}
            onChange={(e) => {
              setSemester(e.target.value);
              setMessage("");
              setError("");
            }}
            className="w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >

            <option value="">
              Select Semester
            </option>

            <option value="Semester 1">
              Semester 1
            </option>

            <option value="Semester 2">
              Semester 2
            </option>

            <option value="Semester 3">
              Semester 3
            </option>

            <option value="Semester 4">
              Semester 4
            </option>

          </select>

        </div>

      </div>

      {/* ==========================================
          PDF UPLOAD
      ========================================== */}

      <div className="mt-6">

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Result PDF
        </label>

        <label
          htmlFor="resultPdf"
          className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-2xl h-48 cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 transition"
        >

          <FileText
            size={45}
            className="text-blue-500"
          />

          {file ? (
            <>
              <h3 className="mt-4 text-lg font-semibold text-gray-700 text-center px-4">
                {file.name}
              </h3>

              <p className="text-sm text-green-600 mt-1">
                PDF selected
              </p>
            </>
          ) : (
            <>
              <h3 className="mt-4 text-lg font-semibold text-gray-700">
                Select Result PDF
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Click to browse PDF file
              </p>
            </>
          )}

          <input
            id="resultPdf"
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleFileChange}
            className="hidden"
          />

        </label>

      </div>

      {/* ==========================================
          SUCCESS MESSAGE
      ========================================== */}

      {message && (
        <div className="mt-5 flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-green-700">

          <CheckCircle size={20} />

          <p className="text-sm font-medium">
            {message}
          </p>

        </div>
      )}

      {/* ==========================================
          ERROR MESSAGE
      ========================================== */}

      {error && (
        <div className="mt-5 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-700">

          <XCircle size={20} />

          <p className="text-sm font-medium">
            {error}
          </p>

        </div>
      )}

      {/* ==========================================
          UPLOAD BUTTON
      ========================================== */}

      <button
        type="button"
        onClick={handleUpload}
        disabled={loading}
        className={`w-full mt-6 h-12 rounded-xl text-white font-semibold transition duration-300 shadow-lg ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl active:scale-95 cursor-pointer"
        }`}
      >

        {loading
          ? "Uploading Result..."
          : "Upload Result"}

      </button>

    </div>
  );
};

export default UploadResultCard;