package com.resultsync.controller;

import com.resultsync.dto.FacultyLoginRequest;
import com.resultsync.dto.FacultyLoginResponse;
import com.resultsync.entity.Faculty;
import com.resultsync.service.FacultyService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/faculty")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
public class FacultyController {

    private final FacultyService facultyService;

    public FacultyController(
            FacultyService facultyService) {

        this.facultyService = facultyService;
    }

    // ==========================================
    // FACULTY LOGIN
    // ==========================================

    @PostMapping(
            value = "/login",
            consumes = "application/json",
            produces = "application/json"
    )
    public ResponseEntity<?> login(
            @RequestBody FacultyLoginRequest request) {

        try {

            FacultyLoginResponse response =
                    facultyService.login(request);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(e.getMessage());
        }
    }

    // ==========================================
    // GET FACULTY
    // ==========================================

    @GetMapping(
            value = "/{facultyId}",
            produces = "application/json"
    )
    public ResponseEntity<?> getFaculty(
            @PathVariable Long facultyId) {

        try {

            Faculty faculty =
                    facultyService.getFacultyById(
                            facultyId
                    );

            FacultyLoginResponse response =
                    new FacultyLoginResponse(
                            true,
                            "Faculty found",
                            faculty.getId(),
                            faculty.getName(),
                            faculty.getEmail(),
                            faculty.getDepartment(),
                            faculty.getRole()
                    );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }
}