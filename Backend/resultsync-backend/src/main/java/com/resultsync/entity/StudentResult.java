package com.resultsync.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "student_results",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_student_class_semester",
                        columnNames = {
                                "student_id",
                                "student_class",
                                "semester"
                        }
                )
        }
)
public class StudentResult {

    // =====================================================
    // PRIMARY KEY
    // =====================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;


    // =====================================================
    // STUDENT
    // =====================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "student_id",
            nullable = false
    )
    @JsonIgnore
    private Student student;


    // =====================================================
    // RESULT INFORMATION
    // =====================================================

    @Column(
            name = "seat_number",
            nullable = false
    )
    private String seatNumber;


    @Column(
            name = "student_name",
            nullable = false
    )
    private String studentName;


    @Column(
            name = "student_class",
            nullable = false
    )
    private String studentClass;


    @Column(
            name = "semester",
            nullable = false
    )
    private String semester;


    // =====================================================
    // SUBJECTS
    // =====================================================

    @ElementCollection
    @CollectionTable(
            name = "result_subjects",
            joinColumns = @JoinColumn(
                    name = "result_id"
            )
    )
    private List<ResultSubject> subjects =
            new ArrayList<>();


    // =====================================================
    // OVERALL RESULT
    // =====================================================

    @Column(name = "percentage")
    private Double percentage;


    @Column(name = "cgpa")
    private Double cgpa;


    @Column(name = "result_status")
    private String resultStatus;


    // =====================================================
    // PDF FILE NAME
    // =====================================================

    @Column(name = "pdf_file_name")
    private String pdfFileName;


    // =====================================================
    // PDF CONTENT
    // =====================================================

    @Lob
    @Column(
            name = "pdf_data",
            columnDefinition = "LONGBLOB"
    )
    @JsonIgnore
    private byte[] pdfData;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public StudentResult() {
    }


    // =====================================================
    // ID
    // =====================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    // =====================================================
    // STUDENT
    // =====================================================

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }


    // =====================================================
    // SEAT NUMBER
    // =====================================================

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }


    // =====================================================
    // STUDENT NAME
    // =====================================================

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }


    // =====================================================
    // STUDENT CLASS
    // =====================================================

    public String getStudentClass() {
        return studentClass;
    }

    public void setStudentClass(String studentClass) {
        this.studentClass = studentClass;
    }


    // =====================================================
    // SEMESTER
    // =====================================================

    public String getSemester() {
        return semester;
    }

    public void setSemester(String semester) {
        this.semester = semester;
    }


    // =====================================================
    // SUBJECTS
    // =====================================================

    public List<ResultSubject> getSubjects() {
        return subjects;
    }

    public void setSubjects(List<ResultSubject> subjects) {
        this.subjects = subjects;
    }


    // =====================================================
    // PERCENTAGE
    // =====================================================

    public Double getPercentage() {
        return percentage;
    }

    public void setPercentage(Double percentage) {
        this.percentage = percentage;
    }


    // =====================================================
    // CGPA
    // =====================================================

    public Double getCgpa() {
        return cgpa;
    }

    public void setCgpa(Double cgpa) {
        this.cgpa = cgpa;
    }


    // =====================================================
    // RESULT STATUS
    // =====================================================

    public String getResultStatus() {
        return resultStatus;
    }

    public void setResultStatus(String resultStatus) {
        this.resultStatus = resultStatus;
    }


    // =====================================================
    // PDF FILE NAME
    // =====================================================

    public String getPdfFileName() {
        return pdfFileName;
    }

    public void setPdfFileName(String pdfFileName) {
        this.pdfFileName = pdfFileName;
    }


    // =====================================================
    // PDF DATA
    // =====================================================

    public byte[] getPdfData() {
        return pdfData;
    }

    public void setPdfData(byte[] pdfData) {
        this.pdfData = pdfData;
    }
}