import React from "react";

import {
  Users,
  BookOpen,
  FileText,
  Trophy,
} from "lucide-react";


const DashboardStats = ({
  results = [],
  selectedClass = "",
  selectedSemester = "",
  loading = false,
}) => {

  /*
   * ============================================================
   * TOTAL STUDENTS
   * ============================================================
   */

  const totalStudents =
    Array.isArray(results)
      ? results.length
      : 0;


  /*
   * ============================================================
   * TOTAL SUBJECTS
   *
   * Get unique subject codes from all students.
   *
   * Example:
   *
   * MCA-531
   * MCA-532
   * MCA-533
   *
   * If every student has the same subjects,
   * they will only be counted once.
   * ============================================================
   */

  const subjectCodes = new Set();


  if (Array.isArray(results)) {

    results.forEach((student) => {

      if (
        Array.isArray(student?.subjects)
      ) {

        student.subjects.forEach(
          (subject) => {

            if (
              subject?.subjectCode
            ) {

              subjectCodes.add(
                subject.subjectCode
              );

            }

          }
        );

      }

    });

  }


  const totalSubjects =
    subjectCodes.size;


  /*
   * ============================================================
   * RESULTS ANALYZED
   * ============================================================
   */

  const resultsAnalyzed =
    totalStudents;


  /*
   * ============================================================
   * TOP STUDENTS
   *
   * Maximum 10 students are displayed.
   * ============================================================
   */

  const topStudents =
    Math.min(
      totalStudents,
      10
    );


  /*
   * ============================================================
   * STAT DATA
   * ============================================================
   */

  const stats = [
    {
      title: "Total Students",
      value: totalStudents,
      subtitle:
        selectedClass && selectedSemester
          ? `${selectedClass} • ${selectedSemester}`
          : "Select Class & Semester",
      icon: Users,
      iconStyle:
        "bg-blue-100 text-blue-600",
    },

    {
      title: "Total Subjects",
      value: totalSubjects,
      subtitle:
        selectedClass && selectedSemester
          ? `${selectedSemester}`
          : "Select Class & Semester",
      icon: BookOpen,
      iconStyle:
        "bg-green-100 text-green-600",
    },

    {
      title: "Results Analyzed",
      value: resultsAnalyzed,
      subtitle:
        selectedClass && selectedSemester
          ? "Current Selection"
          : "Select Class & Semester",
      icon: FileText,
      iconStyle:
        "bg-purple-100 text-purple-600",
    },

    {
      title: "Top Students",
      value: topStudents,
      subtitle:
        topStudents > 0
          ? "Based on Percentage & CGPA"
          : "No Results Available",
      icon: Trophy,
      iconStyle:
        "bg-orange-100 text-orange-500",
    },
  ];


  /*
   * ============================================================
   * UI
   * ============================================================
   */

  return (
    <section
      className="
        grid
        grid-cols-2
        gap-3
        md:grid-cols-2
        lg:grid-cols-4
        lg:gap-5
      "
    >

      {stats.map(
        (stat, index) => {

          const Icon =
            stat.icon;

          return (

            <div
              key={index}
              className="
                flex
                items-center
                gap-3
                rounded-2xl
                border
                border-gray-100
                bg-white
                p-4
                shadow-md
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-xl
                sm:p-5
              "
            >

              {/* ==================================================
                  ICON
              ================================================== */}

              <div
                className={`
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  ${stat.iconStyle}
                  sm:h-14
                  sm:w-14
                `}
              >

                <Icon
                  size={26}
                  strokeWidth={2}
                />

              </div>


              {/* ==================================================
                  CONTENT
              ================================================== */}

              <div className="min-w-0">

                <h2
                  className="
                    text-xl
                    font-bold
                    text-gray-800
                    sm:text-2xl
                  "
                >

                  {loading ? (
                    <span className="animate-pulse">
                      ...
                    </span>
                  ) : (
                    stat.value
                  )}

                </h2>


                <p
                  className="
                    truncate
                    text-xs
                    font-semibold
                    text-gray-700
                    sm:text-sm
                  "
                >
                  {stat.title}
                </p>


                <p
                  className="
                    mt-1
                    truncate
                    text-[10px]
                    text-gray-400
                    sm:text-xs
                  "
                  title={stat.subtitle}
                >
                  {stat.subtitle}
                </p>

              </div>

            </div>

          );

        }
      )}

    </section>
  );
};


export default DashboardStats;