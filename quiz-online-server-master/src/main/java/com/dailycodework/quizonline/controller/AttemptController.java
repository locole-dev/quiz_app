package com.dailycodework.quizonline.controller;

import com.dailycodework.quizonline.dto.AttemptDTO;
import com.dailycodework.quizonline.dto.UserAnswerDTO;
import com.dailycodework.quizonline.service.AttemptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attempts")
public class AttemptController {

    @Autowired
    private AttemptService attemptService;

    @PostMapping("/submit")
    public ResponseEntity<AttemptDTO> submitQuiz(@RequestBody UserAnswerDTO userAnswerDTO) throws Exception {
        AttemptDTO submittedAttempt = attemptService.submitQuiz(userAnswerDTO);
        return new ResponseEntity<>(submittedAttempt, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AttemptDTO> getAttemptById(@PathVariable Long id) throws Exception {
        AttemptDTO attempt = attemptService.getAttemptById(id);
        return ResponseEntity.ok(attempt);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AttemptDTO>> getAttemptsByUserId(@PathVariable Long userId) {
        List<AttemptDTO> attempts = attemptService.getAttemptsByUserId(userId);
        return ResponseEntity.ok(attempts);
    }

    @GetMapping("/quiz/{quizId}")
    public ResponseEntity<List<AttemptDTO>> getAttemptsByQuizId(@PathVariable Long quizId) {
        List<AttemptDTO> attempts = attemptService.getAttemptsByQuizId(quizId);
        return ResponseEntity.ok(attempts);
    }
}
