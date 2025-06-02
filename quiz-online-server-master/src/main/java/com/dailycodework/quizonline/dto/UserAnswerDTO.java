package com.dailycodework.quizonline.dto;

import lombok.Data;
import java.util.Map;

@Data
public class UserAnswerDTO {
    private Long quizId;
    private Long userId; // ID của người dùng làm bài
    private Map<Long, String> answers; // Key: Question ID, Value: User's selected answer
}