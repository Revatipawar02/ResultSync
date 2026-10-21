package com.resultsync.controller;

import com.resultsync.dto.ParsedResult;
import com.resultsync.entity.StudentResult;
import com.resultsync.service.ResultService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/results")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
public class StudentResultController {


    private final ResultService resultService;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public StudentResultController(
            ResultService resultService) {

        this.resultService = resultService;
    }


    // =====================================================
    // UPLOAD RESULT PDF
    // =====================================================

    @PostMapping(
            value = "/upload",
            consumes = "multipart/form-data"
    )
    public ResponseEntity<?> uploadResult(

            @RequestParam("file")
            MultipartFile file,

            @RequestParam("studentClass")
            String studentClass,

            @RequestParam("semester")
            String semester) {

        try {

            StudentResult result =
                    resultService.uploadAndSaveResult(
                            file,
                            studentClass,
                            semester
                    );


            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(result);


        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // TEST PDF PARSER
    // =====================================================

    @PostMapping(
            value = "/test-parser",
            consumes = "multipart/form-data"
    )
    public ResponseEntity<?> testParser(

            @RequestParam("file")
            MultipartFile file,

            @RequestParam("semester")
            String semester) {

        try {

            ParsedResult result =
                    resultService.testParse(
                            file,
                            semester
                    );


            return ResponseEntity.ok(
                    result
            );


        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // GET ALL RESULTS OF STUDENT
    // =====================================================

    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getStudentResults(

            @PathVariable Long studentId) {

        try {

            List<StudentResult> results =
                    resultService
                            .getResultsByStudentId(
                                    studentId
                            );


            return ResponseEntity.ok(
                    results
            );


        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // GET RESULT BY ID
    // =====================================================

    @GetMapping("/{resultId}")
    public ResponseEntity<?> getResult(

            @PathVariable Long resultId) {

        try {

            StudentResult result =
                    resultService
                            .getResultById(
                                    resultId
                            );


            return ResponseEntity.ok(
                    result
            );


        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // DOWNLOAD RESULT PDF
    // =====================================================

    @GetMapping("/{resultId}/download")
    public ResponseEntity<?> downloadResultPdf(

            @PathVariable Long resultId) {

        try {

            StudentResult result =
                    resultService.getResultById(
                            resultId
                    );


            byte[] pdfData =
                    result.getPdfData();


            if (pdfData == null ||
                    pdfData.length == 0) {

                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(
                                "PDF file not found in database"
                        );
            }


            String fileName =
                    result.getPdfFileName();


            if (fileName == null ||
                    fileName.isBlank()) {

                fileName =
                        "result-" +
                                resultId +
                                ".pdf";
            }


            return ResponseEntity
                    .ok()

                    .contentType(
                            MediaType.APPLICATION_PDF
                    )

                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" +
                                    fileName +
                                    "\""
                    )

                    .body(pdfData);


        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }
}