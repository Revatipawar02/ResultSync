package com.resultsync.controller;

import com.resultsync.entity.Student;
import com.resultsync.service.StudentService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // =========================
    // STUDENT REGISTRATION
    // =========================
    @PostMapping("/register")
    public ResponseEntity<?> registerStudent(
            @RequestBody Student student) {

        try {
            Student savedStudent =
                    studentService.registerStudent(student);

            return ResponseEntity.ok(savedStudent);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================
    // STUDENT LOGIN
    // =========================
    @PostMapping("/login")
public ResponseEntity<?> loginStudent(
        @RequestBody Student student) {

    try {

        Student loggedInStudent =
                studentService.loginStudent(
                        student.getEmail(),
                        student.getPassword()
                );

        return ResponseEntity.ok(loggedInStudent);

    } catch (RuntimeException e) {

        return ResponseEntity.badRequest()
                .body(e.getMessage());
    }
}

    // =========================
    // STUDENT PROFILE
    // =========================
    @GetMapping("/{id}")
    public ResponseEntity<?> getStudentProfile(
            @PathVariable Long id) {

        try {
            Student student =
                    studentService.getStudentById(id);

            return ResponseEntity.ok(student);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

// =========================
// UPDATE STUDENT PROFILE
// =========================
@PutMapping("/{id}")
public ResponseEntity<?> updateStudentProfile(
        @PathVariable Long id,
        @RequestBody Student updatedStudent) {

    try {

        Student student =
                studentService.updateStudent(
                        id,
                        updatedStudent
                );

        return ResponseEntity.ok(student);

    } catch (RuntimeException e) {

        return ResponseEntity.badRequest()
                .body(e.getMessage());
    }
}

}