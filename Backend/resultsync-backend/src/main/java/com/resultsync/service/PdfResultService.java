package com.resultsync.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class PdfResultService {


    public String extractText(MultipartFile file) {

        if (file == null || file.isEmpty()) {

            throw new RuntimeException(
                    "PDF file is empty"
            );
        }


        String fileName =
                file.getOriginalFilename();


        if (fileName == null ||
                !fileName.toLowerCase().endsWith(".pdf")) {

            throw new RuntimeException(
                    "Please upload a PDF file"
            );
        }


        try {

            byte[] pdfBytes =
                    file.getBytes();


            try (PDDocument document =
                         Loader.loadPDF(pdfBytes)) {

                PDFTextStripper stripper =
                        new PDFTextStripper();

                return stripper.getText(document);
            }


        } catch (IOException e) {

            throw new RuntimeException(
                    "Unable to read PDF: "
                            + e.getMessage()
            );
        }
    }
}