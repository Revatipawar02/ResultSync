
import React, { useEffect, useState } from "react";

import {
  FileText,
  Download,
  CheckCircle2,
  XCircle,
  Loader2,
  History,
} from "lucide-react";


const UploadHistory = ({
  refreshTrigger = 0,
}) => {

  // =====================================================
  // STATES
  // =====================================================

  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =====================================================
  // GET LOGGED-IN STUDENT ID
  // =====================================================

  const getStudentId = () => {

    try {

      // -------------------------------------------------
      // OPTION 1
      // localStorage.student
      // -------------------------------------------------

      const studentData =
        localStorage.getItem("student");

      if (studentData) {

        const student =
          JSON.parse(studentData);

        if (student?.id) {
          return student.id;
        }
      }


      // -------------------------------------------------
      // OPTION 2
      // localStorage.user
      // -------------------------------------------------

      const userData =
        localStorage.getItem("user");

      if (userData) {

        const user =
          JSON.parse(userData);

        if (user?.id) {
          return user.id;
        }
      }


      // -------------------------------------------------
      // OPTION 3
      // localStorage.studentId
      // -------------------------------------------------

      const studentId =
        localStorage.getItem("studentId");

      if (studentId) {
        return studentId;
      }


      return null;

    } catch (error) {

      console.error(
        "Error getting student ID:",
        error
      );

      return null;
    }
  };


  // =====================================================
  // FETCH PREVIOUS UPLOADS
  // =====================================================

  const fetchHistory = async () => {

    setLoading(true);
    setError("");


    const studentId =
      getStudentId();


    // -------------------------------------------------
    // STUDENT ID NOT FOUND
    // -------------------------------------------------

    if (!studentId) {

      setHistory([]);

      setError(
        "Student information not found. Please login again."
      );

      setLoading(false);

      return;
    }


    try {

      console.log(
        "Fetching result history for student:",
        studentId
      );


      const response = await fetch(
        `http://localhost:8080/api/results/student/${studentId}`
      );


      const responseText =
        await response.text();


      console.log(
        "History API status:",
        response.status
      );


      console.log(
        "History API response:",
        responseText
      );


      if (!response.ok) {

        throw new Error(
          responseText ||
          "Unable to load previous uploads."
        );
      }


      let data = [];

      try {

        data =
          JSON.parse(responseText);

      } catch (parseError) {

        console.error(
          "JSON parsing error:",
          parseError
        );

        data = [];
      }


      // -------------------------------------------------
      // CHECK ARRAY
      // -------------------------------------------------

      if (Array.isArray(data)) {

        setHistory(data);

      } else {

        setHistory([]);

      }

    } catch (error) {

      console.error(
        "History fetch error:",
        error
      );

      setHistory([]);

      setError(
        error.message ||
        "Unable to load previous uploads."
      );

    } finally {

      setLoading(false);
    }
  };


  // =====================================================
  // LOAD HISTORY
  //
  // Runs:
  // 1. First time component loads
  // 2. After successful upload
  // =====================================================

  useEffect(() => {

    fetchHistory();

  }, [refreshTrigger]);


  // =====================================================
  // DOWNLOAD PDF
  // =====================================================

  const handleDownload = async (item) => {

    try {

      if (!item?.id) {

        throw new Error(
          "Result ID not found."
        );
      }


      const response = await fetch(
        `http://localhost:8080/api/results/${item.id}/download`
      );


      if (!response.ok) {

        const errorText =
          await response.text();

        throw new Error(
          errorText ||
          "Unable to download PDF."
        );
      }


      // -------------------------------------------------
      // CONVERT RESPONSE TO BLOB
      // -------------------------------------------------

      const blob =
        await response.blob();


      // -------------------------------------------------
      // CREATE TEMPORARY URL
      // -------------------------------------------------

      const url =
        window.URL.createObjectURL(blob);


      // -------------------------------------------------
      // CREATE DOWNLOAD LINK
      // -------------------------------------------------

      const link =
        document.createElement("a");


      link.href = url;


      link.download =
        item.pdfFileName ||
        `result-${item.id}.pdf`;


      document.body.appendChild(link);


      link.click();


      // -------------------------------------------------
      // CLEANUP
      // -------------------------------------------------

      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (error) {

      console.error(
        "PDF download error:",
        error
      );


      alert(
        error.message ||
        "Unable to download PDF."
      );
    }
  };


  // =====================================================
  // LOADING UI
  // =====================================================

  if (loading) {

    return (

      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">

        <div className="flex items-center gap-3">

          <Loader2
            size={22}
            className="text-blue-600 animate-spin"
          />

          <p className="text-gray-600 text-sm">

            Loading previous uploads...

          </p>

        </div>

      </div>

    );
  }


  // =====================================================
  // MAIN UI
  // =====================================================

  return (

    <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">


      {/* =================================================
          HEADING
      ================================================= */}

      <div className="mb-6">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">

            <History
              size={22}
              className="text-blue-600"
            />

          </div>


          <div>

            <h2 className="text-2xl font-bold text-gray-800">

              Previous Uploads

            </h2>


            <p className="text-gray-500 text-sm mt-1">

              View your previously uploaded result PDFs.

            </p>

          </div>

        </div>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3">

          <div className="flex items-center gap-2">

            <XCircle
              size={18}
              className="text-red-500"
            />

            <p className="text-sm text-red-600">

              {error}

            </p>

          </div>

        </div>

      )}


      {/* =================================================
          EMPTY HISTORY
      ================================================= */}

      {history.length === 0 && !error && (

        <div className="py-12 text-center">

          <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center">

            <FileText
              size={30}
              className="text-gray-400"
            />

          </div>


          <h3 className="mt-4 text-lg font-semibold text-gray-700">

            No Previous Uploads

          </h3>


          <p className="mt-1 text-sm text-gray-500">

            You have not uploaded any result yet.

          </p>

        </div>

      )}


      {/* =================================================
          RESULTS EXIST
      ================================================= */}

      {history.length > 0 && (

        <>


          {/* =================================================
              DESKTOP TABLE
          ================================================= */}

          <div className="hidden md:block overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b text-left text-gray-500 text-sm">

                  <th className="pb-4">
                    Semester
                  </th>


                  <th className="pb-4">
                    PDF File
                  </th>


                  <th className="pb-4">
                    Percentage
                  </th>


                  <th className="pb-4">
                    CGPA
                  </th>


                  <th className="pb-4">
                    Result
                  </th>


                  <th className="pb-4 text-center">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {history.map((item) => (

                  <tr
                    key={item.id}
                    className="border-b hover:bg-gray-50 transition"
                  >


                    {/* SEMESTER */}

                    <td className="py-5 font-medium text-gray-800">

                      {item.semester || "-"}

                    </td>


                    {/* PDF FILE */}

                    <td>

                      <div className="flex items-center gap-2">

                        <FileText
                          size={18}
                          className="text-blue-600 flex-shrink-0"
                        />


                        <span className="max-w-[220px] truncate">

                          {item.pdfFileName ||
                            "Result PDF"}

                        </span>

                      </div>

                    </td>


                    {/* PERCENTAGE */}

                    <td>

                      {item.percentage !== null &&
                      item.percentage !== undefined
                        ? `${item.percentage}%`
                        : "-"}

                    </td>


                    {/* CGPA */}

                    <td>

                      {item.cgpa !== null &&
                      item.cgpa !== undefined
                        ? item.cgpa
                        : "-"}

                    </td>


                    {/* RESULT STATUS */}

                    <td>

                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          item.resultStatus === "PASS"
                            ? "bg-green-100 text-green-700"
                            : item.resultStatus === "FAIL"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >

                        {item.resultStatus === "FAIL" ? (

                          <XCircle size={14} />

                        ) : (

                          <CheckCircle2 size={14} />

                        )}


                        {item.resultStatus ||
                          "Unknown"}

                      </span>

                    </td>


                    {/* DOWNLOAD */}

                    <td className="text-center">

                      <button
                        type="button"
                        onClick={() =>
                          handleDownload(item)
                        }
                        className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition"
                        title="Download PDF"
                      >

                        <Download
                          size={18}
                          className="text-blue-600"
                        />

                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>


          {/* =================================================
              MOBILE CARDS
          ================================================= */}

          <div className="md:hidden space-y-4">

            {history.map((item) => (

              <div
                key={item.id}
                className="border rounded-2xl p-4 shadow-sm"
              >


                {/* FILE */}

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">

                    <FileText
                      className="text-blue-600"
                      size={23}
                    />

                  </div>


                  <div className="min-w-0">

                    <h3 className="font-semibold text-gray-800 truncate">

                      {item.pdfFileName ||
                        "Result PDF"}

                    </h3>


                    <p className="text-sm text-gray-500">

                      {item.semester || "-"}

                    </p>

                  </div>

                </div>


                {/* RESULT DETAILS */}

                <div className="mt-4 space-y-2 text-sm">


                  <p>

                    <span className="font-medium">
                      Percentage:
                    </span>{" "}

                    {item.percentage !== null &&
                    item.percentage !== undefined
                      ? `${item.percentage}%`
                      : "-"}

                  </p>


                  <p>

                    <span className="font-medium">
                      CGPA:
                    </span>{" "}

                    {item.cgpa !== null &&
                    item.cgpa !== undefined
                      ? item.cgpa
                      : "-"}

                  </p>


                  <div>

                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        item.resultStatus === "PASS"
                          ? "bg-green-100 text-green-700"
                          : item.resultStatus === "FAIL"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >

                      {item.resultStatus === "FAIL" ? (

                        <XCircle size={14} />

                      ) : (

                        <CheckCircle2 size={14} />

                      )}


                      {item.resultStatus ||
                        "Unknown"}

                    </span>

                  </div>

                </div>


                {/* DOWNLOAD BUTTON */}

                <button
                  type="button"
                  onClick={() =>
                    handleDownload(item)
                  }
                  className="mt-4 w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium flex items-center justify-center gap-2 hover:shadow-lg transition active:scale-[0.98]"
                >

                  <Download size={18} />

                  Download PDF

                </button>

              </div>

            ))}

          </div>

        </>

      )}

    </div>

  );
};

export default UploadHistory;
