package com.resultsync.service;

import com.resultsync.entity.ResultSubject;
import com.resultsync.entity.StudentResult;
import com.resultsync.repository.StudentResultRepository;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.*;

@Service
public class FacultyResultService {

    private final StudentResultRepository studentResultRepository;

    public FacultyResultService(
            StudentResultRepository studentResultRepository) {

        this.studentResultRepository =
                studentResultRepository;
    }

    /*
     * ============================================================
     * GET ALL SEMESTERS
     * ============================================================
     */
    public List<String> getSemesters() {

        return studentResultRepository
                .findDistinctSemesters();
    }

    /*
     * ============================================================
     * GET CLASSES FOR SELECTED SEMESTER
     * ============================================================
     */
    public List<String> getClasses(
            String semester) {

        if (semester == null ||
                semester.isBlank()) {

            throw new RuntimeException(
                    "Semester is required");
        }

        return studentResultRepository
                .findDistinctClassesBySemester(
                        semester.trim());
    }

    /*
     * ============================================================
     * GET FILTERED RESULTS
     *
     * Class + Semester
     *
     * Percentage DESC
     * CGPA DESC
     * ============================================================
     */
    @Transactional(readOnly = true)
    public List<StudentResult> getFilteredResults(
            String studentClass,
            String semester) {

        validateFilters(
                studentClass,
                semester);

        List<StudentResult> results =
                studentResultRepository
                        .findByStudentClassAndSemesterOrderByPercentageDescCgpaDesc(
                                studentClass.trim(),
                                semester.trim());

        if (results.isEmpty()) {

            throw new RuntimeException(
                    "No student results found for "
                            + studentClass
                            + " - "
                            + semester);
        }

        return results;
    }

    /*
     * ============================================================
     * GENERATE EXCEL
     * ============================================================
     */
    @Transactional(readOnly = true)
    public byte[] generateExcel(
            String studentClass,
            String semester) {

        /*
         * Get filtered results
         */
        List<StudentResult> results =
                getFilteredResults(
                        studentClass,
                        semester);

        /*
         * ========================================================
         * FIND ALL SUBJECT CODES
         *
         * Dynamic subjects.
         * Nothing is hard-coded.
         * ========================================================
         */
        LinkedHashSet<String> subjectCodes =
                new LinkedHashSet<>();

        for (StudentResult result : results) {

            if (result.getSubjects() == null) {
                continue;
            }

            for (ResultSubject subject :
                    result.getSubjects()) {

                if (subject == null) {
                    continue;
                }

                String subjectCode =
                        subject.getSubjectCode();

                if (subjectCode == null ||
                        subjectCode.isBlank()) {

                    continue;
                }

                subjectCodes.add(
                        subjectCode.trim());
            }
        }

        /*
         * ========================================================
         * CREATE WORKBOOK
         * ========================================================
         */
        try (
                Workbook workbook =
                        new XSSFWorkbook();

                ByteArrayOutputStream outputStream =
                        new ByteArrayOutputStream()
        ) {

            Sheet sheet =
                    workbook.createSheet(
                            "Student Results");

            /*
             * ====================================================
             * TITLE STYLE
             * ====================================================
             */
            CellStyle titleStyle =
                    workbook.createCellStyle();

            Font titleFont =
                    workbook.createFont();

            titleFont.setBold(true);
            titleFont.setFontHeightInPoints(
                    (short) 14);

            titleStyle.setFont(titleFont);

            titleStyle.setAlignment(
                    HorizontalAlignment.CENTER);

            titleStyle.setVerticalAlignment(
                    VerticalAlignment.CENTER);

            /*
             * ====================================================
             * INFORMATION STYLE
             * ====================================================
             */
            CellStyle infoStyle =
                    workbook.createCellStyle();

            Font infoFont =
                    workbook.createFont();

            infoFont.setBold(true);

            infoStyle.setFont(infoFont);

            /*
             * ====================================================
             * HEADER STYLE
             * ====================================================
             */
            CellStyle headerStyle =
                    workbook.createCellStyle();

            Font headerFont =
                    workbook.createFont();

            headerFont.setBold(true);

            headerFont.setColor(
                    IndexedColors.WHITE.getIndex());

            headerStyle.setFont(headerFont);

            headerStyle.setFillForegroundColor(
                    IndexedColors.BLUE.getIndex());

            headerStyle.setFillPattern(
                    FillPatternType.SOLID_FOREGROUND);

            headerStyle.setAlignment(
                    HorizontalAlignment.CENTER);

            headerStyle.setVerticalAlignment(
                    VerticalAlignment.CENTER);

            headerStyle.setWrapText(true);

            /*
             * ====================================================
             * CENTER STYLE
             * ====================================================
             */
            CellStyle centerStyle =
                    workbook.createCellStyle();

            centerStyle.setAlignment(
                    HorizontalAlignment.CENTER);

            centerStyle.setVerticalAlignment(
                    VerticalAlignment.CENTER);

            /*
             * ====================================================
             * TITLE
             * ====================================================
             */

            Row titleRow =
                    sheet.createRow(0);

            titleRow.setHeightInPoints(25);

            Cell titleCell =
                    titleRow.createCell(0);

            titleCell.setCellValue(
                    "STUDENT RESULT REPORT");

            titleCell.setCellStyle(
                    titleStyle);

            /*
             * ====================================================
             * TOTAL COLUMNS
             *
             * 3 fixed columns:
             * Sr.No
             * Seat
             * Students Name
             *
             * 2 columns per subject:
             * Marks
             * Status
             *
             * 3 final columns:
             * CGPA
             * %
             * Result
             * ====================================================
             */
            int totalColumns =
                    3 +
                    (subjectCodes.size() * 2) +
                    3;

            /*
             * ====================================================
             * IMPORTANT FIX
             *
             * Merge A1:lastColumn ONLY ONCE.
             * ====================================================
             */
            sheet.addMergedRegion(
                    new CellRangeAddress(
                            0,
                            0,
                            0,
                            totalColumns - 1
                    )
            );

            /*
             * ====================================================
             * CLASS / SEMESTER / TOTAL STUDENTS
             * ====================================================
             */

            Row classRow =
                    sheet.createRow(2);

            /*
             * Class
             */
            Cell classLabel =
                    classRow.createCell(0);

            classLabel.setCellValue(
                    "Class:");

            classLabel.setCellStyle(
                    infoStyle);

            Cell classValue =
                    classRow.createCell(1);

            classValue.setCellValue(
                    studentClass.trim());

            /*
             * Semester
             */
            Cell semesterLabel =
                    classRow.createCell(3);

            semesterLabel.setCellValue(
                    "Semester:");

            semesterLabel.setCellStyle(
                    infoStyle);

            Cell semesterValue =
                    classRow.createCell(4);

            semesterValue.setCellValue(
                    semester.trim());

            /*
             * Total students
             */
            Cell totalLabel =
                    classRow.createCell(6);

            totalLabel.setCellValue(
                    "Total Students:");

            totalLabel.setCellStyle(
                    infoStyle);

            Cell totalValue =
                    classRow.createCell(7);

            totalValue.setCellValue(
                    results.size());

            /*
             * ====================================================
             * HEADER ROW
             * ====================================================
             */

            int headerRowNumber = 4;

            Row headerRow =
                    sheet.createRow(
                            headerRowNumber);

            int column = 0;

            /*
             * Sr.No
             */
            headerRow
                    .createCell(column++)
                    .setCellValue("Sr.No");

            /*
             * Seat
             */
            headerRow
                    .createCell(column++)
                    .setCellValue("Seat");

            /*
             * Student Name
             */
            headerRow
                    .createCell(column++)
                    .setCellValue(
                            "Students Name");

            /*
             * ====================================================
             * DYNAMIC SUBJECT COLUMNS
             * ====================================================
             */

            for (String subjectCode :
                    subjectCodes) {

                headerRow
                        .createCell(column++)
                        .setCellValue(
                                subjectCode +
                                        " Marks");

                headerRow
                        .createCell(column++)
                        .setCellValue(
                                subjectCode +
                                        " Status");
            }

            /*
             * CGPA
             */
            headerRow
                    .createCell(column++)
                    .setCellValue(
                            "CGPA");

            /*
             * Percentage
             */
            headerRow
                    .createCell(column++)
                    .setCellValue("%");

            /*
             * Result
             */
            headerRow
                    .createCell(column++)
                    .setCellValue(
                            "Result");

            /*
             * Apply header style
             */
            for (int i = 0;
                    i < column;
                    i++) {

                headerRow
                        .getCell(i)
                        .setCellStyle(
                                headerStyle);
            }

            /*
             * ====================================================
             * STUDENT DATA
             * ====================================================
             */

            int rowNumber =
                    headerRowNumber + 1;

            int rank = 1;

            for (StudentResult result :
                    results) {

                Row row =
                        sheet.createRow(
                                rowNumber++);

                int cellIndex = 0;

                /*
                 * Sr.No
                 */
                row.createCell(cellIndex++)
                        .setCellValue(
                                rank++);

                /*
                 * Seat
                 */
                row.createCell(cellIndex++)
                        .setCellValue(
                                safeString(
                                        result.getSeatNumber()));

                /*
                 * Student Name
                 */
                row.createCell(cellIndex++)
                        .setCellValue(
                                safeString(
                                        result.getStudentName()));

                /*
                 * =================================================
                 * CREATE SUBJECT MAP
                 * =================================================
                 */

                Map<String, ResultSubject>
                        studentSubjects =
                        new HashMap<>();

                if (result.getSubjects() != null) {

                    for (ResultSubject subject :
                            result.getSubjects()) {

                        if (subject == null ||
                                subject.getSubjectCode() == null ||
                                subject.getSubjectCode()
                                        .isBlank()) {

                            continue;
                        }

                        studentSubjects.put(
                                subject.getSubjectCode()
                                        .trim(),
                                subject);
                    }
                }

                /*
                 * =================================================
                 * WRITE SUBJECT DATA
                 * =================================================
                 */

                for (String subjectCode :
                        subjectCodes) {

                    ResultSubject subject =
                            studentSubjects.get(
                                    subjectCode);

                    /*
                     * Marks
                     */
                    if (subject != null &&
                            subject.getMarks() != null) {

                        row.createCell(
                                cellIndex++)
                                .setCellValue(
                                        subject.getMarks());

                    } else {

                        row.createCell(
                                cellIndex++)
                                .setCellValue("");
                    }

                    /*
                     * Status
                     */
                    if (subject != null &&
                            subject.getStatus() != null) {

                        row.createCell(
                                cellIndex++)
                                .setCellValue(
                                        subject.getStatus());

                    } else {

                        row.createCell(
                                cellIndex++)
                                .setCellValue("");
                    }
                }

                /*
                 * =================================================
                 * CGPA
                 * =================================================
                 */

                if (result.getCgpa() != null) {

                    row.createCell(
                            cellIndex++)
                            .setCellValue(
                                    result.getCgpa());

                } else {

                    row.createCell(
                            cellIndex++)
                            .setCellValue("");
                }

                /*
                 * =================================================
                 * PERCENTAGE
                 * =================================================
                 */

                if (result.getPercentage() != null) {

                    row.createCell(
                            cellIndex++)
                            .setCellValue(
                                    result.getPercentage());

                } else {

                    row.createCell(
                            cellIndex++)
                            .setCellValue("");
                }

                /*
                 * =================================================
                 * RESULT
                 * =================================================
                 */

                row.createCell(
                        cellIndex++)
                        .setCellValue(
                                safeString(
                                        result.getResultStatus()));

                /*
                 * =================================================
                 * CENTER ALL CELLS
                 * =================================================
                 */

                for (int i = 0;
                        i < cellIndex;
                        i++) {

                    row.getCell(i)
                            .setCellStyle(
                                    centerStyle);
                }
            }

            /*
             * ====================================================
             * FREEZE HEADER
             * ====================================================
             */

            sheet.createFreezePane(
                    0,
                    headerRowNumber + 1);

            /*
             * ====================================================
             * AUTO SIZE COLUMNS
             * ====================================================
             */

            for (int i = 0;
                    i < totalColumns;
                    i++) {

                sheet.autoSizeColumn(i);

                /*
                 * Maximum width
                 */
                if (sheet.getColumnWidth(i)
                        > 18000) {

                    sheet.setColumnWidth(
                            i,
                            18000);
                }

                /*
                 * Minimum width
                 */
                if (sheet.getColumnWidth(i)
                        < 3000) {

                    sheet.setColumnWidth(
                            i,
                            3000);
                }
            }

            /*
             * Student name wider
             */
            sheet.setColumnWidth(
                    2,
                    7000);

            /*
             * ====================================================
             * WRITE EXCEL
             * ====================================================
             */

            workbook.write(
                    outputStream);

            return outputStream
                    .toByteArray();

        } catch (IOException e) {

            throw new RuntimeException(
                    "Could not generate Excel file: "
                            + e.getMessage());
        }
    }

    /*
     * ============================================================
     * VALIDATE FILTERS
     * ============================================================
     */
    private void validateFilters(
            String studentClass,
            String semester) {

        if (studentClass == null ||
                studentClass.isBlank()) {

            throw new RuntimeException(
                    "Class is required");
        }

        if (semester == null ||
                semester.isBlank()) {

            throw new RuntimeException(
                    "Semester is required");
        }
    }

    /*
     * ============================================================
     * SAFE STRING
     * ============================================================
     */
    private String safeString(
            String value) {

        return value == null
                ? ""
                : value;
    }
}