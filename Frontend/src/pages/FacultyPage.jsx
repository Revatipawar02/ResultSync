import React, { useEffect, useState } from "react";

import Header from "../components/facultydashboard/Header";
import DashboardStats from "../components/facultydashboard/DashboardStats";
import DownloadStudentRecord from "../components/facultydashboard/DownloadStudentRecord";
import TopStudents from "../components/facultydashboard/TopStudents";

import { getFacultyResults } from "../API/FacultyResultApi";

const FacultyDashboardPage = () => {
  /*
   * ============================================================
   * SELECTED FILTERS
   * ============================================================
   */

  const [selectedClass, setSelectedClass] = useState("");

  const [selectedSemester, setSelectedSemester] =
    useState("");

  /*
   * ============================================================
   * FACULTY RESULTS
   * ============================================================
   */

  const [results, setResults] = useState([]);

  const [loadingResults, setLoadingResults] =
    useState(false);

  const [resultError, setResultError] =
    useState("");


  /*
   * ============================================================
   * LOAD RESULTS WHEN CLASS / SEMESTER CHANGES
   * ============================================================
   */

  useEffect(() => {
    const fetchResults = async () => {

      /*
       * If class or semester is not selected,
       * clear the results.
       */

      if (!selectedClass || !selectedSemester) {
        setResults([]);
        setResultError("");
        return;
      }

      try {
        setLoadingResults(true);
        setResultError("");

        const data = await getFacultyResults(
          selectedClass,
          selectedSemester
        );

        console.log(
          "Faculty Results:",
          data
        );

        setResults(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (error) {

        console.error(
          "Failed to fetch faculty results:",
          error
        );

        setResults([]);

        setResultError(
          error.message ||
            "Failed to load student results."
        );

      } finally {

        setLoadingResults(false);

      }
    };

    fetchResults();

  }, [
    selectedClass,
    selectedSemester,
  ]);


  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-100">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <Header />


      <main
        className="
          mx-auto
          w-full
          max-w-[1400px]
          px-4
          py-6
          sm:px-6
          lg:px-8
          lg:py-8
        "
      >

        {/* ====================================================
            DASHBOARD STATISTICS
        ==================================================== */}

        <DashboardStats
          results={results}
          selectedClass={selectedClass}
          selectedSemester={selectedSemester}
          loading={loadingResults}
        />


        {/* ====================================================
            DOWNLOAD + TOP STUDENTS
        ==================================================== */}

        <div
          className="
            mt-6
            grid
            grid-cols-1
            gap-6
            xl:grid-cols-[minmax(350px,1fr)_minmax(650px,2fr)]
          "
        >

          {/* ==================================================
              DOWNLOAD STUDENT RECORD
          ================================================== */}

          <div className="min-w-0">

            <DownloadStudentRecord
              selectedClass={selectedClass}
              setSelectedClass={setSelectedClass}
              selectedSemester={selectedSemester}
              setSelectedSemester={
                setSelectedSemester
              }
            />

          </div>


          {/* ==================================================
              TOP STUDENTS
          ================================================== */}

          <div className="min-w-0">

            <TopStudents
              results={results}
              selectedClass={selectedClass}
              selectedSemester={
                selectedSemester
              }
              loading={loadingResults}
              error={resultError}
            />

          </div>

        </div>

      </main>

    </div>
  );
};

export default FacultyDashboardPage;