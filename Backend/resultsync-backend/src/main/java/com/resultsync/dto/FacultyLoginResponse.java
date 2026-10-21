package com.resultsync.dto;

public class FacultyLoginResponse {

    private boolean success;
    private String message;
    private Long facultyId;
    private String name;
    private String email;
    private String department;
    private String role;

    public FacultyLoginResponse() {
    }

    public FacultyLoginResponse(
            boolean success,
            String message,
            Long facultyId,
            String name,
            String email,
            String department,
            String role) {

        this.success = success;
        this.message = message;
        this.facultyId = facultyId;
        this.name = name;
        this.email = email;
        this.department = department;
        this.role = role;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getFacultyId() {
        return facultyId;
    }

    public void setFacultyId(Long facultyId) {
        this.facultyId = facultyId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}