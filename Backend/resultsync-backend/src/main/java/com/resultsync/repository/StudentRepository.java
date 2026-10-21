package com.resultsync.repository;

import com.resultsync.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByEmail(String email);

    Optional<Student> findByPrnNumber(String prnNumber);

    boolean existsByEmail(String email);

    boolean existsByPrnNumber(String prnNumber);
}