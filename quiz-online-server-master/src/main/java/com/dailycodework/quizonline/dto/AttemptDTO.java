package com.dailycodework.quizonline.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.Map;

@Data
public class AttemptDTO {
    private Long attemptId;
    private Long quizId;
    private Long userId;
    private Map<Long, String> answers; // Các câu trả lời của người dùng
    private Integer score;
    private LocalDateTime timestamp;
}