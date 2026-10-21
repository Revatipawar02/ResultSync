package com.resultsync.service;

import com.resultsync.dto.ParsedResult;
import com.resultsync.dto.SubjectResult;
import com.resultsync.entity.ResultSubject;
import com.resultsync.entity.Student;
import com.resultsync.entity.StudentResult;
import com.resultsync.repository.StudentRepository;
import com.resultsync.repository.StudentResultRepository;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class ResultService {

    private final PdfResultService pdfResultService;
    private final PdfResultParser pdfResultParser;
    private final StudentRepository studentRepository;
    private final StudentResultRepository studentResultRepository;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public ResultService(
            PdfResultService pdfResultService,
            PdfResultParser pdfResultParser,
            StudentRepository studentRepository,
            StudentResultRepository studentResultRepository) {

        this.pdfResultService = pdfResultService;
        this.pdfResultParser = pdfResultParser;
        this.studentRepository = studentRepository;
        this.studentResultRepository = studentResultRepository;
    }


    // =====================================================
    // UPLOAD AND SAVE RESULT
    // =====================================================

    public StudentResult uploadAndSaveResult(
            MultipartFile file,
            String studentClass,
            String semester) {


        // =================================================
        // 1. VALIDATE FILE
        // =================================================

        if (file == null || file.isEmpty()) {

            throw new RuntimeException(
                    "Please select a PDF file"
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


        // =================================================
        // 2. VALIDATE CLASS
        // =================================================

        if (studentClass == null ||
                studentClass.isBlank()) {

            throw new RuntimeException(
                    "Class is required"
            );
        }


        String studentClassValue =
                studentClass.trim();


        // =================================================
        // 3. VALIDATE SEMESTER
        // =================================================

        if (semester == null ||
                semester.isBlank()) {

            throw new RuntimeException(
                    "Semester is required"
            );
        }


        String semesterValue =
                semester.trim();


        // =================================================
        // 4. EXTRACT PDF TEXT
        // =================================================

        String text =
                pdfResultService.extractText(file);


        // =================================================
        // 5. PARSE PDF
        // =================================================

        ParsedResult parsedResult =
                pdfResultParser.parse(
                        text,
                        semesterValue
                );


        // =================================================
        // 6. VALIDATE PRN
        // =================================================

        if (parsedResult.getPrnNumber() == null ||
                parsedResult.getPrnNumber().isBlank()) {

            throw new RuntimeException(
                    "PRN number not found in PDF"
            );
        }


        // =================================================
        // 7. VALIDATE SEAT NUMBER
        // =================================================

        if (parsedResult.getSeatNumber() == null ||
                parsedResult.getSeatNumber().isBlank()) {

            throw new RuntimeException(
                    "Seat number not found in PDF"
            );
        }


        // =================================================
        // 8. FIND STUDENT
        // =================================================

        String prn =
                parsedResult
                        .getPrnNumber()
                        .trim();


        Student student =
                studentRepository
                        .findByPrnNumber(prn)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student with PRN "
                                                + prn
                                                + " is not registered"
                                )
                        );


        // =================================================
        // 9. CHECK DUPLICATE
        // =================================================

        boolean alreadyExists =
                studentResultRepository
                        .existsByStudentIdAndStudentClassAndSemester(
                                student.getId(),
                                studentClassValue,
                                semesterValue
                        );


        if (alreadyExists) {

            throw new RuntimeException(
                    "Result already uploaded for this student, class and semester"
            );
        }


        // =================================================
        // 10. CREATE RESULT
        // =================================================

        StudentResult result =
                new StudentResult();


        result.setStudent(student);


        result.setSeatNumber(
                parsedResult.getSeatNumber()
        );


        result.setStudentName(
                student.getName()
        );


        // IMPORTANT:
        // Store selected class from frontend

        result.setStudentClass(
                studentClassValue
        );


        // IMPORTANT:
        // Store selected semester

        result.setSemester(
                semesterValue
        );


        // =================================================
        // 11. CONVERT SUBJECTS
        // =================================================

        List<ResultSubject> resultSubjects =
                new ArrayList<>();


        if (parsedResult.getSubjects() != null) {

            for (SubjectResult subject :
                    parsedResult.getSubjects()) {


                if (subject == null ||
                        subject.getSubjectCode() == null ||
                        subject.getSubjectCode().isBlank()) {

                    continue;
                }


                ResultSubject resultSubject =
                        new ResultSubject();


                resultSubject.setSubjectCode(
                        subject
                                .getSubjectCode()
                                .trim()
                );


                resultSubject.setMarks(
                        subject.getMarks()
                );


                resultSubject.setStatus(
                        subject.getStatus()
                );


                resultSubjects.add(
                        resultSubject
                );
            }
        }


        // =================================================
        // 12. VALIDATE SUBJECTS
        // =================================================

        if (resultSubjects.isEmpty()) {

            throw new RuntimeException(
                    "No subject result found in PDF"
            );
        }


        result.setSubjects(
                resultSubjects
        );


        // =================================================
        // 13. PERCENTAGE
        // =================================================

        result.setPercentage(
                parsedResult.getPercentage()
        );


        // =================================================
        // 14. CGPA
        // =================================================

        result.setCgpa(
                parsedResult.getCgpa()
        );


        // =================================================
        // 15. RESULT STATUS
        // =================================================

        result.setResultStatus(
                parsedResult.getResultStatus()
        );


        // =================================================
        // 16. SAVE PDF FILE NAME
        // =================================================

        result.setPdfFileName(
                fileName
        );


        // =================================================
        // 17. SAVE ACTUAL PDF DATA
        // =================================================

        try {

            byte[] pdfBytes =
                    file.getBytes();


            if (pdfBytes == null ||
                    pdfBytes.length == 0) {

                throw new RuntimeException(
                        "PDF file contains no data"
                );
            }


            result.setPdfData(
                    pdfBytes
            );


            System.out.println(
                    "========================================"
            );

            System.out.println(
                    "PDF STORAGE"
            );

            System.out.println(
                    "File Name : "
                            + fileName
            );

            System.out.println(
                    "PDF Size  : "
                            + pdfBytes.length
                            + " bytes"
            );

            System.out.println(
                    "Class     : "
                            + studentClassValue
            );

            System.out.println(
                    "Semester  : "
                            + semesterValue
            );

            System.out.println(
                    "========================================"
            );


        } catch (IOException e) {

            throw new RuntimeException(
                    "Could not read uploaded PDF file: "
                            + e.getMessage()
            );
        }


        // =================================================
        // 18. SAVE RESULT
        // =================================================

        StudentResult savedResult =
                studentResultRepository.save(result);


        studentResultRepository.flush();


        // =================================================
        // 19. DEBUG AFTER SAVE
        // =================================================

        System.out.println(
                "========================================"
        );

        System.out.println(
                "RESULT SAVED"
        );

        System.out.println(
                "Result ID : "
                        + savedResult.getId()
        );

        System.out.println(
                "Student   : "
                        + savedResult.getStudentName()
        );

        System.out.println(
                "Class     : "
                        + savedResult.getStudentClass()
        );

        System.out.println(
                "Semester  : "
                        + savedResult.getSemester()
        );

        System.out.println(
                "PDF Name  : "
                        + savedResult.getPdfFileName()
        );

        System.out.println(
                "PDF Size  : "
                        + (
                            savedResult.getPdfData() == null
                                    ? "NULL"
                                    : savedResult
                                            .getPdfData()
                                            .length
                        )
                        + " bytes"
        );

        System.out.println(
                "========================================"
        );


        return savedResult;
    }


    // =====================================================
    // GET ALL RESULTS OF STUDENT
    // =====================================================

    public List<StudentResult> getResultsByStudentId(
            Long studentId) {

        if (studentId == null) {

            throw new RuntimeException(
                    "Student ID is required"
            );
        }


        if (!studentRepository.existsById(studentId)) {

            throw new RuntimeException(
                    "Student not found"
            );
        }


        return studentResultRepository
                .findByStudentId(studentId);
    }


    // =====================================================
    // GET RESULT BY ID
    // =====================================================

    public StudentResult getResultById(
            Long resultId) {

        if (resultId == null) {

            throw new RuntimeException(
                    "Result ID is required"
            );
        }


        return studentResultRepository
                .findById(resultId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Result not found"
                        )
                );
    }


    // =====================================================
    // TEST PDF PARSER
    // =====================================================

    public ParsedResult testParse(
            MultipartFile file,
            String semester) {


        if (file == null || file.isEmpty()) {

            throw new RuntimeException(
                    "Please select a PDF file"
            );
        }


        if (semester == null ||
                semester.isBlank()) {

            throw new RuntimeException(
                    "Semester is required"
            );
        }


        String text =
                pdfResultService.extractText(file);


        System.out.println();
        System.out.println(
                "========================================"
        );

        System.out.println(
                "EXTRACTED PDF TEXT"
        );

        System.out.println(
                "========================================"
        );

        System.out.println(text);

        System.out.println(
                "========================================"
        );


        ParsedResult result =
                pdfResultParser.parse(
                        text,
                        semester.trim()
                );


        System.out.println();
        System.out.println(
                "========================================"
        );

        System.out.println(
                "PARSED RESULT"
        );

        System.out.println(
                "========================================"
        );


        System.out.println(
                "PRN Number      : "
                        + result.getPrnNumber()
        );


        System.out.println(
                "Seat Number     : "
                        + result.getSeatNumber()
        );


        System.out.println(
                "Student Name    : "
                        + result.getStudentName()
        );


        System.out.println(
                "Semester        : "
                        + result.getSemester()
        );


        System.out.println(
                "Percentage      : "
                        + result.getPercentage()
        );


        System.out.println(
                "CGPA            : "
                        + result.getCgpa()
        );


        System.out.println(
                "Result Status   : "
                        + result.getResultStatus()
        );


        System.out.println();
        System.out.println(
                "SUBJECTS"
        );

        System.out.println(
                "----------------------------------------"
        );


        if (result.getSubjects() != null &&
                !result.getSubjects().isEmpty()) {


            for (SubjectResult subject :
                    result.getSubjects()) {


                System.out.println(
                        "Code   : "
                                + subject.getSubjectCode()
                );


                System.out.println(
                        "Marks  : "
                                + subject.getMarks()
                );


                System.out.println(
                        "Status : "
                                + subject.getStatus()
                );


                System.out.println(
                        "----------------------------------------"
                );
            }


        } else {

            System.out.println(
                    "NO SUBJECTS FOUND"
            );
        }


        System.out.println(
                "========================================"
        );


        return result;
    }
}