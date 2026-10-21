package com.resultsync.controller;

import com.resultsync.dto.ParsedResult;
import com.resultsync.service.PdfResultParser;
import com.resultsync.service.PdfResultService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/results")
@CrossOrigin(origins = "http://localhost:5173")
public class ResultUploadController {

    private final PdfResultService pdfResultService;
    private final PdfResultParser pdfResultParser;

    public ResultUploadController(
            PdfResultService pdfResultService,
            PdfResultParser pdfResultParser) {

        this.pdfResultService = pdfResultService;
        this.pdfResultParser = pdfResultParser;
    }


    // =====================================================
    // PDF RESULT PARSE
    // =====================================================

    @PostMapping("/parse")
    public ResponseEntity<?> parseResultPdf(
            @RequestParam("file") MultipartFile file,
            @RequestParam("semester") String semester) {

        try {

            // 1. Extract text from PDF
            String text =
                    pdfResultService.extractText(file);


            // 2. Parse important result data
            ParsedResult result =
                    pdfResultParser.parse(
                            text,
                            semester
                    );


            // 3. Return parsed data
            return ResponseEntity.ok(result);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .body("Error processing PDF");
        }
    }
}