package com.dailycodework.quizonline.service;



import com.dailycodework.quizonline.dto.AttemptDTO;
import com.dailycodework.quizonline.dto.UserAnswerDTO;

import java.util.List;

public interface AttemptService {
    AttemptDTO submitQuiz(UserAnswerDTO userAnswerDTO) throws Exception;
    AttemptDTO getAttemptById(Long id) throws Exception;
    List<AttemptDTO> getAttemptsByUserId(Long userId);
    List<AttemptDTO> getAttemptsByQuizId(Long quizId);
}