package com.dailycodework.quizonline.service;

import com.dailycodework.quizonline.dto.QuizDTO;
import com.dailycodework.quizonline.model.Quiz;
import java.util.List;
import java.util.Optional;

public interface QuizService {
    QuizDTO createQuiz(QuizDTO quiz);
    QuizDTO getQuizById(Long id) throws Exception;
    List<QuizDTO> getAllQuizes();
    QuizDTO updateQuiz(Long id, QuizDTO quiz) throws Exception;
    void deleteQuiz(Long id) throws Exception;

    List<QuizDTO> getActiveQuizes();
}
