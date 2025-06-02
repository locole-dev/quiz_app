package com.dailycodework.quizonline.controller;

import com.dailycodework.quizonline.dto.QuizDTO;
import com.dailycodework.quizonline.model.Quiz;
import com.dailycodework.quizonline.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {
    @Autowired
    private QuizService quizService;

    @PostMapping
    public ResponseEntity<QuizDTO> createQuiz(@RequestBody QuizDTO quizz) {
        return ResponseEntity.ok(quizService.createQuiz(quizz));
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuizDTO> getQuizById(@PathVariable Long id) throws Exception {
        QuizDTO quizDTO = quizService.getQuizById(id);
        if (quizDTO != null) {
            return ResponseEntity.ok(quizDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<QuizDTO>> getAllQuizes() {

        return ResponseEntity.ok(quizService.getAllQuizes());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<QuizDTO> updateQuizz(@PathVariable Long id, @RequestBody QuizDTO quizz) throws Exception {
        return ResponseEntity.ok(quizService.updateQuiz(id, quizz));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable Long id) throws Exception {
        quizService.deleteQuiz(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/active")
    public ResponseEntity<List<QuizDTO>> getActiveQuizzes() {
        List<QuizDTO> activeQuizzes = quizService.getActiveQuizes();
        return ResponseEntity.ok(activeQuizzes);
    }
}
