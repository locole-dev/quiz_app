package com.dailycodework.quizonline.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class QuizDTO {
    private Long quizId;
    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Long duration;
    private Integer numberOfQuestions;
}
