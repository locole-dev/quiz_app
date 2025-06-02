package com.dailycodework.quizonline.dto;


import lombok.Data;
import java.time.LocalDateTime;
import java.util.Map;

@Data
public class ResultDTO {
    private Long attemptId;
    private Long userId;
    private String userName; // Tên người dùng
    private Long quizId;
    private String quizTitle; // Tên Quiz
    private Integer score;
    private LocalDateTime timestamp;
    private Map<Long, String> userAnswers; // Key: Question ID, Value: User's selected answer
    private Map<Long, String> correctAnswers; // Key: Question ID, Value: Correct answer
    private Map<Long, String> questionTexts; // Key: Question ID, Value: Question text
    private Integer totalQuestions; // Tổng số câu hỏi
}