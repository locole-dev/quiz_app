package com.dailycodework.quizonline.dto;


import lombok.Data;
import java.util.Map;

@Data
public class QuestionDTO {
    private Long questionId;
    private Long quizId; // ID của Quiz mà câu hỏi này thuộc về
    private String questionText;
    private Map<String, String> options; // Key: lựa chọn (A, B, C...), Value: nội dung lựa chọn
    private String correctAnswer;
}