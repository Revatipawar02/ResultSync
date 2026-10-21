package com.resultsync.dto;

public class SubjectResult {

    private String subjectCode;
    private Double marks;
    private String status;


    public SubjectResult() {
    }


    public SubjectResult(
            String subjectCode,
            Double marks,
            String status) {

        this.subjectCode = subjectCode;
        this.marks = marks;
        this.status = status;
    }


    // ==============================
    // Subject Code
    // ==============================

    public String getSubjectCode() {
        return subjectCode;
    }

    public void setSubjectCode(String subjectCode) {
        this.subjectCode = subjectCode;
    }


    // ==============================
    // Marks
    // ==============================

    public Double getMarks() {
        return marks;
    }

    public void setMarks(Double marks) {
        this.marks = marks;
    }


    // ==============================
    // Status
    // ==============================

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}