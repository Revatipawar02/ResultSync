import React from "react";

import {
  Trophy,
  Medal,
  Crown,
  Award,
  Loader2,
} from "lucide-react";


const getRankIcon = (rank) => {

  if (rank === 1) {

    return (
      <Crown
        size={22}
        className="text-yellow-500"
      />
    );

  }


  if (rank === 2) {

    return (
      <Medal
        size={22}
        className="text-gray-400"
      />
    );

  }


  if (rank === 3) {

    return (
      <Award
        size={22}
        className="text-orange-500"
      />
    );

  }


  return (
    <span
      className="
        flex
        h-8
        w-8
        items-center
        justify-center
        rounded-full
        bg-blue-50
        text-sm
        font-bold
        text-blue-600
      "
    >
      {rank}
    </span>
  );

};


const formatNumber = (value) => {

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "-";
  }

  const number =
    Number(value);

  if (Number.isNaN(number)) {
    return value;
  }

  return number.toFixed(2);

};


const TopStudents = ({
  results = [],
  selectedClass = "",
  selectedSemester = "",
  loading = false,
  error = "",
}) => {

  /*
   * ============================================================
   * TOP 10
   *
   * Backend already sorts:
   *
   * Percentage DESC
   * CGPA DESC
   *
   * slice(0, 10) keeps only top 10.
   * ============================================================
   */

  const topStudents =
    Array.isArray(results)
      ? results.slice(0, 10)
      : [];


  return (
    <section
      className="
        rounded-3xl
        border
        border-gray-200
        bg-white
        p-5
        shadow-lg
        sm:p-6
      "
    >

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div
        className="
          mb-5
          flex
          items-center
          justify-between
          gap-3
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <div
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-yellow-100
            "
          >

            <Trophy
              size={26}
              className="text-yellow-600"
            />

          </div>


          <div>

            <h2
              className="
                text-lg
                font-bold
                text-gray-800
                sm:text-xl
              "
            >
              Top 10 Students
            </h2>


            <p
              className="
                text-xs
                text-gray-500
                sm:text-sm
              "
            >
              Ranked by Percentage and CGPA
            </p>

          </div>

        </div>


        {/* ==================================================
            SELECTED SEMESTER / CLASS
        ================================================== */}

        <div className="hidden text-right sm:block">

          <span
            className="
              rounded-lg
              bg-blue-50
              px-3
              py-1
              text-xs
              font-semibold
              text-blue-600
            "
          >
            {selectedClass || "-"}
          </span>


          <p
            className="
              mt-1
              text-[10px]
              text-gray-400
            "
          >
            {selectedSemester || "No Semester"}
          </p>

        </div>

      </div>


      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (

        <div
          className="
            mb-4
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            text-sm
            text-red-600
          "
        >
          {error}
        </div>

      )}


      {/* ======================================================
          LOADING
      ====================================================== */}

      {loading ? (

        <div
          className="
            flex
            min-h-[300px]
            items-center
            justify-center
            text-gray-500
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
              text-sm
            "
          >

            <Loader2
              size={22}
              className="animate-spin"
            />

            Loading top students...

          </div>

        </div>

      ) : topStudents.length === 0 ? (

        /* ====================================================
           NO DATA
        ==================================================== */

        <div
          className="
            flex
            min-h-[300px]
            flex-col
            items-center
            justify-center
            text-center
          "
        >

          <div
            className="
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              bg-gray-100
            "
          >

            <Trophy
              size={30}
              className="text-gray-400"
            />

          </div>


          <h3
            className="
              mt-4
              text-base
              font-semibold
              text-gray-700
            "
          >
            No Student Results
          </h3>


          <p
            className="
              mt-1
              max-w-sm
              text-sm
              text-gray-400
            "
          >
            Select a class and semester
            with available student results.
          </p>

        </div>

      ) : (

        /* ====================================================
           TABLE
        ==================================================== */

        <div className="overflow-x-auto">

          <table
            className="
              w-full
              min-w-[650px]
            "
          >

            <thead>

              <tr
                className="
                  border-b
                  border-gray-200
                  bg-gray-50
                  text-left
                "
              >

                <th
                  className="
                    px-4
                    py-3
                    text-xs
                    font-semibold
                    text-gray-500
                  "
                >
                  Rank
                </th>


                <th
                  className="
                    px-4
                    py-3
                    text-xs
                    font-semibold
                    text-gray-500
                  "
                >
                  Student
                </th>


                <th
                  className="
                    px-4
                    py-3
                    text-xs
                    font-semibold
                    text-gray-500
                  "
                >
                  Seat Number
                </th>


                <th
                  className="
                    px-4
                    py-3
                    text-xs
                    font-semibold
                    text-gray-500
                  "
                >
                  CGPA
                </th>


                <th
                  className="
                    px-4
                    py-3
                    text-xs
                    font-semibold
                    text-gray-500
                  "
                >
                  Percentage
                </th>


                <th
                  className="
                    px-4
                    py-3
                    text-xs
                    font-semibold
                    text-gray-500
                  "
                >
                  Result
                </th>

              </tr>

            </thead>


            <tbody>

              {topStudents.map(
                (student, index) => {

                  const rank =
                    index + 1;


                  return (

                    <tr
                      key={
                        student.id ??
                        `${student.seatNumber}-${rank}`
                      }
                      className="
                        border-b
                        border-gray-100
                        transition
                        hover:bg-blue-50/50
                      "
                    >

                      {/* ====================================
                          RANK
                      ==================================== */}

                      <td
                        className="
                          px-4
                          py-3
                        "
                      >

                        <div
                          className="
                            flex
                            items-center
                            justify-center
                          "
                        >

                          {getRankIcon(
                            rank
                          )}

                        </div>

                      </td>


                      {/* ====================================
                          STUDENT NAME
                      ==================================== */}

                      <td
                        className="
                          px-4
                          py-3
                        "
                      >

                        <p
                          className="
                            text-sm
                            font-semibold
                            text-gray-800
                          "
                        >
                          {student.studentName ||
                            "Unknown Student"}
                        </p>

                      </td>


                      {/* ====================================
                          SEAT NUMBER
                      ==================================== */}

                      <td
                        className="
                          px-4
                          py-3
                          text-sm
                          text-gray-500
                        "
                      >
                        {student.seatNumber || "-"}
                      </td>


                      {/* ====================================
                          CGPA
                      ==================================== */}

                      <td
                        className="
                          px-4
                          py-3
                        "
                      >

                        <span
                          className="
                            font-bold
                            text-blue-600
                          "
                        >
                          {formatNumber(
                            student.cgpa
                          )}
                        </span>

                      </td>


                      {/* ====================================
                          PERCENTAGE
                      ==================================== */}

                      <td
                        className="
                          px-4
                          py-3
                          text-sm
                          font-medium
                          text-gray-700
                        "
                      >

                        {formatNumber(
                          student.percentage
                        )}
                        %

                      </td>


                      {/* ====================================
                          RESULT
                      ==================================== */}

                      <td
                        className="
                          px-4
                          py-3
                        "
                      >

                        <span
                          className="
                            rounded-lg
                            bg-green-100
                            px-3
                            py-1
                            text-xs
                            font-bold
                            text-green-700
                          "
                        >
                          {student.resultStatus ||
                            "-"}
                        </span>

                      </td>

                    </tr>

                  );

                }
              )}

            </tbody>

          </table>

        </div>

      )}

    </section>
  );
};


export default TopStudents;