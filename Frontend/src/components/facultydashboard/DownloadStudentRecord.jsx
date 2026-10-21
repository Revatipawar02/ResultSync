import React, { useEffect, useState } from "react";

import {
  FileSpreadsheet,
  Download,
  Info,
  Loader2,
} from "lucide-react";

import {
  getFacultySemesters,
  getFacultyClasses,
  downloadFacultyExcel,
} from "../../API/FacultyResultApi";

const DownloadStudentRecord = ({
  selectedClass,
  setSelectedClass,
  selectedSemester,
  setSelectedSemester,
}) => {
  const [semesters, setSemesters] = useState([]);

  const [classes, setClasses] = useState([]);

  const [loadingSemesters, setLoadingSemesters] =
    useState(false);

  const [loadingClasses, setLoadingClasses] =
    useState(false);

  const [downloading, setDownloading] =
    useState(false);

  const [error, setError] = useState("");

  /*
   * ============================================================
   * LOAD SEMESTERS
   * ============================================================
   */

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        setLoadingSemesters(true);
        setError("");

        const data = await getFacultySemesters();

        console.log(
          "Faculty Semesters:",
          data
        );

        const semesterList =
          Array.isArray(data) ? data : [];

        setSemesters(semesterList);

        if (
          semesterList.length > 0 &&
          !selectedSemester
        ) {
          setSelectedSemester(
            semesterList[0]
          );
        }
      } catch (err) {
        console.error(
          "Failed to load semesters:",
          err
        );

        setError(
          err.message ||
            "Failed to load semesters."
        );
      } finally {
        setLoadingSemesters(false);
      }
    };

    fetchSemesters();
  }, [selectedSemester, setSelectedSemester]);

  /*
   * ============================================================
   * LOAD CLASSES WHEN SEMESTER CHANGES
   * ============================================================
   */

  useEffect(() => {
    const fetchClasses = async () => {
      if (!selectedSemester) {
        setClasses([]);
        setSelectedClass("");
        return;
      }

      try {
        setLoadingClasses(true);
        setError("");

        const data = await getFacultyClasses(
          selectedSemester
        );

        console.log(
          "Faculty Classes:",
          data
        );

        const classList =
          Array.isArray(data) ? data : [];

        setClasses(classList);

        if (
          classList.length > 0 &&
          !classList.includes(selectedClass)
        ) {
          setSelectedClass(
            classList[0]
          );
        }

        if (classList.length === 0) {
          setSelectedClass("");
        }
      } catch (err) {
        console.error(
          "Failed to load classes:",
          err
        );

        setClasses([]);
        setSelectedClass("");

        setError(
          err.message ||
            "Failed to load classes."
        );
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchClasses();
  }, [
    selectedSemester,
    selectedClass,
    setSelectedClass,
  ]);

  /*
   * ============================================================
   * DOWNLOAD EXCEL
   * ============================================================
   */

  const handleDownload = async () => {
    setError("");

    if (!selectedClass) {
      setError("Please select a class.");
      return;
    }

    if (!selectedSemester) {
      setError("Please select a semester.");
      return;
    }

    try {
      setDownloading(true);

      await downloadFacultyExcel(
        selectedClass,
        selectedSemester
      );

      console.log(
        "Excel downloaded successfully."
      );
    } catch (err) {
      console.error(
        "Excel download error:",
        err
      );

      setError(
        err.message ||
          "Failed to download Excel file."
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-6">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex items-start gap-4 mb-6">

        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
          <FileSpreadsheet
            size={25}
            className="text-green-600"
          />
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Download Student Records
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Select class and semester to
            download student result records.
          </p>
        </div>

      </div>

      {/* ======================================================
          FILTERS
      ====================================================== */}

      <div className="space-y-5">

        {/* CLASS */}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Class
          </label>

          <select
            value={selectedClass}
            onChange={(e) =>
              setSelectedClass(
                e.target.value
              )
            }
            disabled={
              loadingClasses ||
              classes.length === 0
            }
            className="
              w-full
              h-12
              rounded-xl
              border
              border-gray-300
              px-4
              bg-white
              text-gray-700
              outline-none
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-200
              disabled:bg-gray-100
              disabled:cursor-not-allowed
            "
          >
            <option value="">
              {loadingClasses
                ? "Loading classes..."
                : "Select Class"}
            </option>

            {classes.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* SEMESTER */}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Semester
          </label>

          <select
            value={selectedSemester}
            onChange={(e) =>
              setSelectedSemester(
                e.target.value
              )
            }
            disabled={
              loadingSemesters ||
              semesters.length === 0
            }
            className="
              w-full
              h-12
              rounded-xl
              border
              border-gray-300
              px-4
              bg-white
              text-gray-700
              outline-none
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-200
              disabled:bg-gray-100
              disabled:cursor-not-allowed
            "
          >
            <option value="">
              {loadingSemesters
                ? "Loading semesters..."
                : "Select Semester"}
            </option>

            {semesters.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* ======================================================
          INFORMATION
      ====================================================== */}

      <div className="mt-6 flex gap-3 rounded-xl bg-blue-50 border border-blue-200 px-4 py-3">

        <Info
          size={20}
          className="text-blue-600 flex-shrink-0 mt-0.5"
        />

        <p className="text-sm text-blue-700">
          The Excel file will contain
          student subject-wise marks,
          subject status, CGPA, percentage,
          and result status.
        </p>

      </div>

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="mt-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
          <p className="text-sm font-medium text-red-700">
            {error}
          </p>
        </div>
      )}

      {/* ======================================================
          DOWNLOAD BUTTON
      ====================================================== */}

      <button
        type="button"
        onClick={handleDownload}
        disabled={
          downloading ||
          !selectedClass ||
          !selectedSemester
        }
        className="
          w-full
          mt-6
          h-12
          rounded-xl
          bg-gradient-to-r
          from-green-600
          to-emerald-600
          text-white
          font-semibold
          flex
          items-center
          justify-center
          gap-2
          shadow-lg
          transition
          duration-300
          hover:shadow-xl
          active:scale-95
          disabled:bg-gray-400
          disabled:from-gray-400
          disabled:to-gray-400
          disabled:cursor-not-allowed
          disabled:active:scale-100
        "
      >
        {downloading ? (
          <>
            <Loader2
              size={20}
              className="animate-spin"
            />

            Downloading...
          </>
        ) : (
          <>
            <Download size={20} />

            Download Excel
          </>
        )}
      </button>

      {/* ======================================================
          SELECTED FILTER
      ====================================================== */}

      {selectedClass &&
        selectedSemester && (
          <p className="mt-4 text-center text-xs text-gray-500">
            Downloading records for{" "}
            <span className="font-semibold text-gray-700">
              {selectedClass}
            </span>{" "}
            —{" "}
            <span className="font-semibold text-gray-700">
              {selectedSemester}
            </span>
          </p>
        )}

    </div>
  );
};

export default DownloadStudentRecord;