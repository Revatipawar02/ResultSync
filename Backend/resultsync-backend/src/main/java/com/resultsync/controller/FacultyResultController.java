package com.resultsync.controller;

import com.resultsync.entity.StudentResult;
import com.resultsync.service.FacultyResultService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faculty/results")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
public class FacultyResultController {

    private final FacultyResultService
            facultyResultService;

    public FacultyResultController(
            FacultyResultService facultyResultService) {

        this.facultyResultService =
                facultyResultService;
    }


    /*
     * ============================================================
     * GET SEMESTERS
     * ============================================================
     */
    @GetMapping("/semesters")
    public ResponseEntity<?> getSemesters() {

        try {

            List<String> semesters =
                    facultyResultService
                            .getSemesters();

            return ResponseEntity.ok(
                    semesters
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(
                            HttpStatus.BAD_REQUEST
                    )
                    .body(e.getMessage());
        }
    }


    /*
     * ============================================================
     * GET CLASSES BY SEMESTER
     * ============================================================
     */
    @GetMapping("/classes")
    public ResponseEntity<?> getClasses(
            @RequestParam String semester) {

        try {

            List<String> classes =
                    facultyResultService
                            .getClasses(
                                    semester
                            );

            return ResponseEntity.ok(
                    classes
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(
                            HttpStatus.BAD_REQUEST
                    )
                    .body(e.getMessage());
        }
    }


    /*
     * ============================================================
     * GET FILTERED STUDENT RESULTS
     * ============================================================
     */
    @GetMapping
    public ResponseEntity<?> getResults(
            @RequestParam String studentClass,
            @RequestParam String semester) {

        try {

            List<StudentResult> results =
                    facultyResultService
                            .getFilteredResults(
                                    studentClass,
                                    semester
                            );

            return ResponseEntity.ok(
                    results
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(
                            HttpStatus.NOT_FOUND
                    )
                    .body(e.getMessage());
        }
    }


    /*
     * ============================================================
     * DOWNLOAD EXCEL
     * ============================================================
     */
    @GetMapping("/download-excel")
    public ResponseEntity<?> downloadExcel(
            @RequestParam String studentClass,
            @RequestParam String semester) {

        try {

            byte[] excelData =
                    facultyResultService
                            .generateExcel(
                                    studentClass,
                                    semester
                            );


            String safeClass =
                    studentClass
                            .trim()
                            .replaceAll(
                                    "[^a-zA-Z0-9-_]",
                                    "_"
                            );

            String safeSemester =
                    semester
                            .trim()
                            .replaceAll(
                                    "[^a-zA-Z0-9-_]",
                                    "_"
                            );


            String fileName =
                    "Student_Results_"
                            + safeClass
                            + "_"
                            + safeSemester
                            + ".xlsx";


            return ResponseEntity
                    .ok()
                    .contentType(
                            MediaType.parseMediaType(
                                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            )
                    )
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\""
                                    + fileName
                                    + "\""
                    )
                    .body(excelData);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(
                            HttpStatus.BAD_REQUEST
                    )
                    .body(e.getMessage());
        }
    }
}