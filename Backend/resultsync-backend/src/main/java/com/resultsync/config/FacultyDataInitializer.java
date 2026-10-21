package com.resultsync.config;

import com.resultsync.entity.Faculty;
import com.resultsync.repository.FacultyRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class FacultyDataInitializer {

    @Bean
    CommandLineRunner createDefaultFaculty(
            FacultyRepository facultyRepository) {

        return args -> {

            String email =
                    "admin@resultsync.com";

            if (!facultyRepository
                    .findByEmail(email)
                    .isPresent()) {

                BCryptPasswordEncoder encoder =
                        new BCryptPasswordEncoder();

                Faculty faculty =
                        new Faculty();

                faculty.setName("Admin");

                faculty.setEmail(email);

                faculty.setPassword(
                        encoder.encode("Admin@123")
                );

                faculty.setDepartment(
                        "Computer Science"
                );

                faculty.setRole("FACULTY");

                facultyRepository.save(faculty);

                System.out.println(
                        "========================================"
                );

                System.out.println(
                        "DEFAULT FACULTY CREATED"
                );

                System.out.println(
                        "Email    : admin@resultsync.com"
                );

                System.out.println(
                        "Password : Admin@123"
                );

                System.out.println(
                        "========================================"
                );
            }
        };
    }
}