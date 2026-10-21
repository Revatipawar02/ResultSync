package com.resultsync.service;

import com.resultsync.dto.FacultyLoginRequest;
import com.resultsync.dto.FacultyLoginResponse;
import com.resultsync.entity.Faculty;
import com.resultsync.repository.FacultyRepository;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class FacultyService {

    private final FacultyRepository facultyRepository;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public FacultyService(
            FacultyRepository facultyRepository) {

        this.facultyRepository = facultyRepository;
    }

    // ==========================================
    // FACULTY LOGIN
    // ==========================================

    public FacultyLoginResponse login(
            FacultyLoginRequest request) {

        if (request == null) {
            throw new RuntimeException(
                    "Login request is required"
            );
        }

        if (request.getEmail() == null ||
                request.getEmail().isBlank()) {

            throw new RuntimeException(
                    "Email is required"
            );
        }

        if (request.getPassword() == null ||
                request.getPassword().isBlank()) {

            throw new RuntimeException(
                    "Password is required"
            );
        }

        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();

        Faculty faculty =
                facultyRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid faculty email or password"
                                )
                        );

        boolean passwordCorrect =
                passwordEncoder.matches(
                        request.getPassword(),
                        faculty.getPassword()
                );

        if (!passwordCorrect) {
            throw new RuntimeException(
                    "Invalid faculty email or password"
            );
        }

        return new FacultyLoginResponse(
                true,
                "Faculty login successful",
                faculty.getId(),
                faculty.getName(),
                faculty.getEmail(),
                faculty.getDepartment(),
                faculty.getRole()
        );
    }

    // ==========================================
    // GET FACULTY
    // ==========================================

    public Faculty getFacultyById(
            Long facultyId) {

        if (facultyId == null) {
            throw new RuntimeException(
                    "Faculty ID is required"
            );
        }

        return facultyRepository
                .findById(facultyId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Faculty not found"
                        )
                );
    }
}