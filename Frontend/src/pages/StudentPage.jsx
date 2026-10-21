
import React, { useEffect, useState } from "react";

import Header from "../components/studentdashboard/Header";
import StudentProfileCard from "../components/studentdashboard/StudentProfilleCard";
import UploadResultCard from "../components/studentdashboard/UploadResultCard";
import UploadHistory from "../components/studentdashboard/UploadHistory";


const StudentPage = () => {

  // =====================================================
  // STATES
  // =====================================================

  const [showProfile, setShowProfile] =
    useState(false);

  const [results, setResults] =
    useState([]);

  const [loadingHistory, setLoadingHistory] =
    useState(true);

  const [historyError, setHistoryError] =
    useState("");


  // =====================================================
  // GET LOGGED-IN STUDENT ID
  // =====================================================

  const studentId =
    localStorage.getItem("studentId");


  // =====================================================
  // FETCH PREVIOUS RESULTS
  // =====================================================

  const fetchResults = async () => {

    // ---------------------------------------------------
    // STUDENT ID NOT FOUND
    // ---------------------------------------------------

    if (!studentId) {

      setResults([]);

      setLoadingHistory(false);

      setHistoryError(
        "Student information not found. Please login again."
      );

      return;
    }


    try {

      setLoadingHistory(true);

      setHistoryError("");


      // -------------------------------------------------
      // API CALL
      // -------------------------------------------------

      const response = await fetch(
        `http://localhost:8080/api/results/student/${studentId}`
      );


      // -------------------------------------------------
      // READ RESPONSE
      // -------------------------------------------------

      const responseText =
        await response.text();


      let data;

      try {

        data =
          JSON.parse(responseText);

      } catch {

        data =
          responseText;

      }


      // -------------------------------------------------
      // CHECK RESPONSE
      // -------------------------------------------------

      if (!response.ok) {

        throw new Error(
          typeof data === "string"
            ? data
            : data?.message ||
              "Failed to load previous results"
        );
      }


      // -------------------------------------------------
      // SAVE RESULTS
      // -------------------------------------------------

      setResults(
        Array.isArray(data)
          ? data
          : []
      );


    } catch (error) {

      console.error(
        "History Error:",
        error
      );


      setHistoryError(
        error.message ||
        "Failed to load previous results"
      );


      setResults([]);

    } finally {

      setLoadingHistory(false);

    }
  };


  // =====================================================
  // LOAD RESULTS WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {

    fetchResults();

  }, [studentId]);


  // =====================================================
  // AFTER SUCCESSFUL UPLOAD
  // =====================================================

  const handleUploadSuccess = () => {

    // Fetch fresh data from MySQL
    fetchResults();

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="min-h-screen bg-gray-100">

      {/* =================================================
          HEADER
      ================================================= */}

      <Header
        setShowProfile={setShowProfile}
      />


      <div className="max-w-7xl mx-auto px-4 py-6">


        {/* =================================================
            DESKTOP LAYOUT
        ================================================= */}

        <div className="hidden lg:grid lg:grid-cols-3 gap-6">


          {/* STUDENT PROFILE */}

          <StudentProfileCard />


          {/* UPLOAD RESULT */}

          <div className="lg:col-span-2">

            <UploadResultCard
              onUploadSuccess={
                handleUploadSuccess
              }
            />

          </div>

        </div>


        {/* =================================================
            DESKTOP HISTORY
        ================================================= */}

        <div className="hidden lg:block mt-6">

          {loadingHistory ? (

            // LOADING

            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 text-center">

              <p className="text-gray-500">

                Loading previous results...

              </p>

            </div>

          ) : historyError ? (

            // ERROR

            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 text-center">

              <p className="text-red-600">

                {historyError}

              </p>

            </div>

          ) : (

            // HISTORY

            <UploadHistory
              results={results}
            />

          )}

        </div>


        {/* =================================================
            MOBILE LAYOUT
        ================================================= */}

        <div className="lg:hidden">


          {!showProfile ? (

            <>


              {/* =========================================
                  UPLOAD RESULT
              ========================================= */}

              <UploadResultCard
                onUploadSuccess={
                  handleUploadSuccess
                }
              />


              {/* =========================================
                  HISTORY
              ========================================= */}

              <div className="mt-5">

                {loadingHistory ? (

                  <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 text-center">

                    <p className="text-gray-500">

                      Loading previous results...

                    </p>

                  </div>

                ) : historyError ? (

                  <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 text-center">

                    <p className="text-red-600">

                      {historyError}

                    </p>

                  </div>

                ) : (

                  <UploadHistory
                    results={results}
                  />

                )}

              </div>

            </>

          ) : (

            // ===========================================
            // MOBILE PROFILE
            // ===========================================

            <StudentProfileCard
              setShowProfile={
                setShowProfile
              }
            />

          )}

        </div>

      </div>

    </div>

  );

};


export default StudentPage;

