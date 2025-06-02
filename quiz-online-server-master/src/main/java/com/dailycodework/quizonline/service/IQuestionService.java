package com.dailycodework.quizonline.service;

import com.dailycodework.quizonline.dto.QuestionDTO;
import com.dailycodework.quizonline.model.Question;
import org.springframework.data.crossstore.ChangeSetPersister;

import java.util.List;
import java.util.Optional;

/**
 * @author Simpson Alfred
 */

public interface IQuestionService {

    QuestionDTO createQuestion(QuestionDTO questionDTO) throws Exception;
    QuestionDTO getQuestionById(Long id) throws Exception;
    List<QuestionDTO> getQuestionsByQuizId(Long quizId);
    QuestionDTO updateQuestion(Long id, QuestionDTO questionDTO) throws Exception;
    void deleteQuestion(Long id) throws Exception;

}
