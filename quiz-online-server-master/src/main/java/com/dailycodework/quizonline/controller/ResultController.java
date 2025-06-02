package com.dailycodework.quizonline.controller;

import com.dailycodework.quizonline.dto.ResultDTO;
import com.dailycodework.quizonline.service.ResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/results")
public class ResultController {

    @Autowired
    private ResultService resultService;

    @GetMapping("/attempt/{attemptId}")
    public ResponseEntity<ResultDTO> getResultByAttemptId(@PathVariable Long attemptId) throws Exception {
        ResultDTO result = resultService.getResultByAttemptId(attemptId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ResultDTO>> getResultsByUserId(@PathVariable Long userId) {
        List<ResultDTO> results = resultService.getResultsByUserId(userId);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/quiz/{quizId}")
    public ResponseEntity<List<ResultDTO>> getResultsByQuizId(@PathVariable Long quizId) {
        List<ResultDTO> results = resultService.getResultsByQuizId(quizId);
        return ResponseEntity.ok(results);
    }
}