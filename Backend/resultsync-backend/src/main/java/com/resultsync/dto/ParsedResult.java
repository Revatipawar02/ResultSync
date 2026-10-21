package com.resultsync.dto;

import java.util.ArrayList;
import java.util.List;

public class ParsedResult {

    private String seatNumber;
    private String prnNumber;
    private String studentName;
    private String semester;

    private List<SubjectResult> subjects = new ArrayList<>();

    private Double percentage;
    private Double cgpa;
    private String resultStatus;


    public ParsedResult() {
    }


    // ==============================
    // Seat Number
    // ==============================

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }


    // ==============================
    // PRN Number
    // ==============================

    public String getPrnNumber() {
        return prnNumber;
    }

    public void setPrnNumber(String prnNumber) {
        this.prnNumber = prnNumber;
    }


    // ==============================
    // Student Name
    // ==============================

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }


    // ==============================
    // Semester
    // ==============================

    public String getSemester() {
        return semester;
    }

    public void setSemester(String semester) {
        this.semester = semester;
    }


    // ==============================
    // Subjects
    // ==============================

    public List<SubjectResult> getSubjects() {
        return subjects;
    }

    public void setSubjects(List<SubjectResult> subjects) {
        this.subjects = subjects;
    }


    // ==============================
    // Percentage
    // ==============================

    public Double getPercentage() {
        return percentage;
    }

    public void setPercentage(Double percentage) {
        this.percentage = percentage;
    }


    // ==============================
    // CGPA
    // ==============================

    public Double getCgpa() {
        return cgpa;
    }

    public void setCgpa(Double cgpa) {
        this.cgpa = cgpa;
    }


    // ==============================
    // Result Status
    // ==============================

    public String getResultStatus() {
        return resultStatus;
    }

    public void setResultStatus(String resultStatus) {
        this.resultStatus = resultStatus;
    }
}