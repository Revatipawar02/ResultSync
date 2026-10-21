package com.resultsync.repository;

import com.resultsync.entity.StudentResult;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StudentResultRepository
        extends JpaRepository<StudentResult, Long> {


    // =====================================================
    // GET ALL RESULTS OF STUDENT
    // =====================================================

    List<StudentResult> findByStudentId(
            Long studentId
    );


    // =====================================================
    // GET RESULT BY STUDENT + CLASS + SEMESTER
    // =====================================================

    Optional<StudentResult>
    findByStudentIdAndStudentClassAndSemester(
            Long studentId,
            String studentClass,
            String semester
    );


    // =====================================================
    // CHECK DUPLICATE
    // =====================================================

    boolean existsByStudentIdAndStudentClassAndSemester(
            Long studentId,
            String studentClass,
            String semester
    );


    // =====================================================
    // FACULTY
    // CLASS + SEMESTER
    //
    // SORT:
    // Percentage DESC
    // CGPA DESC
    // =====================================================

    List<StudentResult>
    findByStudentClassAndSemesterOrderByPercentageDescCgpaDesc(
            String studentClass,
            String semester
    );


    // =====================================================
    // GET ALL SEMESTERS
    // =====================================================

    @Query("""
            SELECT DISTINCT sr.semester
            FROM StudentResult sr
            ORDER BY sr.semester
            """)
    List<String> findDistinctSemesters();


    // =====================================================
    // GET CLASSES FOR SELECTED SEMESTER
    // =====================================================

    @Query("""
            SELECT DISTINCT sr.studentClass
            FROM StudentResult sr
            WHERE sr.semester = :semester
            ORDER BY sr.studentClass
            """)
    List<String> findDistinctClassesBySemester(
            @Param("semester")
            String semester
    );
}