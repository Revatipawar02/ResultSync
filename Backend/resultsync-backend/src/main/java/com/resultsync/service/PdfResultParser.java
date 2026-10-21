package com.resultsync.service;

import com.resultsync.dto.ParsedResult;
import com.resultsync.dto.SubjectResult;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class PdfResultParser {

    // =====================================================
    // MAIN PARSER
    // =====================================================

    public ParsedResult parse(String text, String semester) {

        if (text == null || text.isBlank()) {
            throw new RuntimeException("PDF text is empty");
        }

        if (semester == null || semester.isBlank()) {
            throw new RuntimeException("Semester is required");
        }

        String selectedSemester = semester.trim();

        ParsedResult result = new ParsedResult();

        // -------------------------------------------------
        // Student Information
        // -------------------------------------------------

        result.setSeatNumber(
                extractSeatNumber(text)
        );

        result.setPrnNumber(
                extractPrnNumber(text)
        );

        result.setStudentName(
                extractStudentName(text)
        );

        result.setSemester(selectedSemester);

        // -------------------------------------------------
        // Extract ONLY selected semester section
        // -------------------------------------------------

        String semesterText =
                extractSemesterSection(
                        text,
                        selectedSemester
                );

        // -------------------------------------------------
        // Subjects
        // -------------------------------------------------

        List<SubjectResult> subjects =
                extractSubjects(semesterText);

        result.setSubjects(subjects);

        // -------------------------------------------------
        // Percentage
        // -------------------------------------------------

        result.setPercentage(
                extractPercentage(
                        semesterText,
                        text
                )
        );

        // -------------------------------------------------
        // CGPA
        // -------------------------------------------------

        result.setCgpa(
                extractCgpa(text)
        );

        // -------------------------------------------------
        // Result Status
        // -------------------------------------------------

        result.setResultStatus(
                calculateResultStatus(subjects)
        );

        return result;
    }


    // =====================================================
    // EXTRACT SELECTED SEMESTER SECTION
    // =====================================================

    private String extractSemesterSection(
            String text,
            String semester) {

        String normalizedSemester =
                semester
                        .trim()
                        .toLowerCase();

        String semesterNumber = null;

        // -------------------------------------------------
        // Detect semester number
        // -------------------------------------------------

        if (normalizedSemester.matches(
                "semester\\s*1|sem[-\\s]*1|1")) {

            semesterNumber = "I";

        } else if (normalizedSemester.matches(
                "semester\\s*2|sem[-\\s]*2|2")) {

            semesterNumber = "II";

        } else if (normalizedSemester.matches(
                "semester\\s*3|sem[-\\s]*3|3")) {

            semesterNumber = "III";

        } else if (normalizedSemester.matches(
                "semester\\s*4|sem[-\\s]*4|4")) {

            semesterNumber = "IV";

        } else {

            throw new RuntimeException(
                    "Invalid semester: " + semester
            );
        }


        // -------------------------------------------------
        // Find semester heading
        //
        // PDF format:
        //
        // Sem-I
        // subjects...
        //
        // Sem-II
        // subjects...
        //
        // SGPA...
        // -------------------------------------------------

        Pattern startPattern = Pattern.compile(
                "(?im)^\\s*Sem\\s*-?\\s*"
                        + semesterNumber
                        + "\\s*$"
        );

        Matcher startMatcher =
                startPattern.matcher(text);


        if (!startMatcher.find()) {

            throw new RuntimeException(
                    "Selected semester section not found in PDF: "
                            + semester
            );
        }


        int startIndex =
                startMatcher.end();


        // -------------------------------------------------
        // Find next semester heading
        // -------------------------------------------------

        Pattern nextSemesterPattern =
                Pattern.compile(
                        "(?im)^\\s*Sem\\s*-?\\s*"
                                + "(I{1,3}|IV)"
                                + "\\s*$"
                );

        Matcher nextMatcher =
                nextSemesterPattern.matcher(
                        text
                );


        int endIndex =
                text.length();


        while (nextMatcher.find(startIndex)) {

            String nextSemester =
                    nextMatcher.group(1);

            if (!nextSemester.equalsIgnoreCase(
                    semesterNumber)) {

                endIndex =
                        nextMatcher.start();

                break;
            }
        }


        // -------------------------------------------------
        // Also stop before SGPA / CGPA summary
        // -------------------------------------------------

        Pattern summaryPattern =
                Pattern.compile(
                        "(?im)^\\s*(SGPA|CGPA)\\s*:?"
                );

        Matcher summaryMatcher =
                summaryPattern.matcher(
                        text.substring(startIndex)
                );


        if (summaryMatcher.find()) {

            int summaryIndex =
                    startIndex
                            + summaryMatcher.start();

            if (summaryIndex < endIndex) {

                endIndex = summaryIndex;
            }
        }


        if (startIndex >= endIndex) {

            throw new RuntimeException(
                    "Could not extract selected semester data"
            );
        }


        return text.substring(
                startIndex,
                endIndex
        );
    }


    // =====================================================
    // SEAT NUMBER
    // =====================================================

    private String extractSeatNumber(String text) {

        Pattern pattern = Pattern.compile(
                "Seat\\s*No\\s*[:\\-]?\\s*([A-Za-z0-9]+)",
                Pattern.CASE_INSENSITIVE
        );

        Matcher matcher =
                pattern.matcher(text);

        if (matcher.find()) {

            return matcher.group(1).trim();
        }

        return null;
    }


    // =====================================================
    // PRN NUMBER
    // =====================================================

    private String extractPrnNumber(String text) {

        Pattern pattern = Pattern.compile(
                "PRN\\s*[:\\-]?\\s*([A-Za-z0-9]+)",
                Pattern.CASE_INSENSITIVE
        );

        Matcher matcher =
                pattern.matcher(text);

        if (matcher.find()) {

            return matcher.group(1).trim();
        }

        return null;
    }


    // =====================================================
    // STUDENT NAME
    // =====================================================

    private String extractStudentName(String text) {

        Pattern pattern = Pattern.compile(
                "Name\\s*[:\\-]?\\s*(.+?)(?:\\s*\\(|\\r?\\n|Academic Bank)",
                Pattern.CASE_INSENSITIVE
        );

        Matcher matcher =
                pattern.matcher(text);

        if (matcher.find()) {

            return matcher.group(1).trim();
        }

        return null;
    }


    // =====================================================
    // SUBJECTS
    // =====================================================

    private List<SubjectResult> extractSubjects(
            String semesterText) {

        List<SubjectResult> subjects =
                new ArrayList<>();

        String[] lines =
                semesterText.split("\\r?\\n");


        /*
         * Expected PDF format:
         *
         * MCA-431 Database Management System (DBMS)
         * P 39 51 90 100 4 O 10 40
         *
         *
         * OR extracted PDF text may appear as:
         *
         * # 1212420001 MCA-431 Database Management System
         * (DBMS) P 39 51 90 100 4 O 10 40
         *
         *
         * P = PASS
         * F = FAIL
         *
         * 39 = Internal
         * 51 = External
         * 90 = Total
         * 100 = Out Of
         */


        /*
         * Subject code supports:
         *
         * MCA-431
         * MCA-435 A
         * MCA-435 B
         * MCA-439 A
         * MCA-439 B
         * RM-417
         */

        Pattern pattern =
                Pattern.compile(
                        "\\b("
                                + "MCA-\\d{3}(?:\\s+[AB])?"
                                + "|RM-\\d{3}"
                                + ")\\b"
                                + ".*?"
                                + "\\b([PF])\\b"
                                + "\\s+"
                                + "(\\d+(?:\\.\\d+)?)"
                                + "\\s+"
                                + "(\\d+(?:\\.\\d+)?)"
                                + "\\s+"
                                + "(\\d+(?:\\.\\d+)?)"
                                + "\\s+"
                                + "(\\d+(?:\\.\\d+)?)"
                                + "\\b",
                        Pattern.CASE_INSENSITIVE
                );


        for (String line : lines) {

            line = line.trim();

            if (line.isEmpty()) {
                continue;
            }


            Matcher matcher =
                    pattern.matcher(line);


            if (matcher.find()) {

                // -----------------------------------------
                // Subject Code
                // -----------------------------------------

                String subjectCode =
                        matcher.group(1)
                                .trim()
                                .toUpperCase();


                // -----------------------------------------
                // P/F Status
                // -----------------------------------------

                String pdfStatus =
                        matcher.group(2)
                                .trim()
                                .toUpperCase();


                // -----------------------------------------
                // Marks
                //
                // group 3 = Internal
                // group 4 = External
                // group 5 = Total
                // group 6 = Out Of
                // -----------------------------------------

                Double totalMarks =
                        Double.parseDouble(
                                matcher.group(5)
                        );


                // -----------------------------------------
                // Convert P/F
                // -----------------------------------------

                String status;

                if ("P".equals(pdfStatus)) {

                    status = "PASS";

                } else {

                    status = "FAIL";
                }


                // -----------------------------------------
                // Create SubjectResult
                // -----------------------------------------

                SubjectResult subject =
                        new SubjectResult();

                subject.setSubjectCode(
                        subjectCode
                );

                subject.setMarks(
                        totalMarks
                );

                subject.setStatus(
                        status
                );


                subjects.add(subject);
            }
        }


        return subjects;
    }


    // =====================================================
    // PERCENTAGE
    // =====================================================

    private Double extractPercentage(
            String semesterText,
            String fullText) {

        /*
         * Semester-specific percentage is not directly
         * given in this PDF.
         *
         * For example:
         *
         * Sem-I:   499/650
         * Sem-II:  552/650
         *
         * Overall:
         *
         * CGPA: 9.19 (1051/1300) (80.85%)
         *
         * Therefore first try Percentage from selected
         * section, then overall percentage as fallback.
         */


        // -------------------------------------------------
        // Percentage keyword
        // -------------------------------------------------

        Pattern percentagePattern =
                Pattern.compile(
                        "Percentage\\s*[:\\-]?\\s*"
                                + "(\\d+(?:\\.\\d+)?)"
                                + "\\s*%",
                        Pattern.CASE_INSENSITIVE
                );


        Matcher matcher =
                percentagePattern.matcher(
                        semesterText
                );


        if (matcher.find()) {

            return Double.parseDouble(
                    matcher.group(1)
            );
        }


        // -------------------------------------------------
        // Overall percentage
        // -------------------------------------------------

        Pattern overallPattern =
                Pattern.compile(
                        "\\((\\d+(?:\\.\\d+)?)\\s*%\\)"
                );


        Matcher overallMatcher =
                overallPattern.matcher(
                        fullText
                );


        if (overallMatcher.find()) {

            return Double.parseDouble(
                    overallMatcher.group(1)
            );
        }


        return null;
    }


    // =====================================================
    // CGPA
    // =====================================================

    private Double extractCgpa(String text) {

        Pattern pattern =
                Pattern.compile(
                        "CGPA\\s*[:\\-]?\\s*"
                                + "(\\d+(?:\\.\\d+)?)",
                        Pattern.CASE_INSENSITIVE
                );


        Matcher matcher =
                pattern.matcher(text);


        if (matcher.find()) {

            return Double.parseDouble(
                    matcher.group(1)
            );
        }


        return null;
    }


    // =====================================================
    // RESULT STATUS
    // =====================================================

    private String calculateResultStatus(
            List<SubjectResult> subjects) {

        if (subjects == null ||
                subjects.isEmpty()) {

            return "UNKNOWN";
        }


        for (SubjectResult subject :
                subjects) {

            if (subject == null) {
                continue;
            }


            if ("FAIL".equalsIgnoreCase(
                    subject.getStatus())) {

                return "FAIL";
            }
        }


        return "PASS";
    }
}