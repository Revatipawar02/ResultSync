package com.resultsync.service;

import com.resultsync.entity.Student;
import com.resultsync.repository.StudentRepository;
import org.springframework.stereotype.Service;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // =========================
    // STUDENT REGISTRATION
    // =========================
    public Student registerStudent(Student student) {

        // Check duplicate email
        if (studentRepository.existsByEmail(student.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Check duplicate PRN
        if (studentRepository.existsByPrnNumber(student.getPrnNumber())) {
            throw new RuntimeException("PRN Number already registered");
        }

        // Save student
        return studentRepository.save(student);
    }

    // =========================
    // STUDENT LOGIN
    // =========================
public Student loginStudent(String loginValue, String password) {

    String value = loginValue.trim();

    Student student = studentRepository
            .findByEmail(value)
            .or(() -> studentRepository.findByPrnNumber(value))
            .orElseThrow(() ->
                    new RuntimeException("Invalid Email/PRN or Password"));

    if (!student.getPassword().equals(password)) {
        throw new RuntimeException("Invalid Email/PRN or Password");
    }

    return student;
}

// =========================
// GET STUDENT PROFILE
// =========================
public Student getStudentById(Long id) {

    return studentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));
    }

// =========================
// UPDATE STUDENT PROFILE
// =========================
public Student updateStudent(
        Long id,
        Student updatedStudent) {

    Student existingStudent =
            studentRepository.findById(id)
                    .orElseThrow(() ->
                            new RuntimeException("Student not found"));

    existingStudent.setName(updatedStudent.getName());
    existingStudent.setEmail(updatedStudent.getEmail());
    existingStudent.setPrnNumber(updatedStudent.getPrnNumber());
    existingStudent.setRollNumber(updatedStudent.getRollNumber());
    existingStudent.setStudentClass(updatedStudent.getStudentClass());

    return studentRepository.save(existingStudent);
}

}