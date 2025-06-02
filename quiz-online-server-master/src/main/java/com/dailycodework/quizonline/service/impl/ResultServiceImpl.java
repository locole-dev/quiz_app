package com.dailycodework.quizonline.service.impl;

import com.dailycodework.quizonline.dto.ResultDTO;
import com.dailycodework.quizonline.model.Account;
import com.dailycodework.quizonline.model.Attempt;
import com.dailycodework.quizonline.model.Question;
import com.dailycodework.quizonline.model.Quiz;
import com.dailycodework.quizonline.repository.AccountRepository;
import com.dailycodework.quizonline.repository.AttemptRepository;
import com.dailycodework.quizonline.repository.QuestionRepository;
import com.dailycodework.quizonline.repository.QuizRepository;
import com.dailycodework.quizonline.service.ResultService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ResultServiceImpl implements ResultService {
    @Autowired
    private AttemptRepository attemptRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private AccountRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    public ResultDTO getResultByAttemptId(Long attemptId) throws Exception {
        Attempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new Exception("Attempt not found with id: " + attemptId));
        Quiz quiz = attempt.getQuiz();
        Account user = attempt.getUser();
        List<Question> questions = questionRepository.findByQuiz_QuizId(quiz.getQuizId());
        Map<Long, String> correctAnswersMap = questions.stream()
                .collect(Collectors.toMap(Question::getQuestionId, Question::getCorrectAnswer));
        Map<Long, String> questionTextsMap = questions.stream()
                .collect(Collectors.toMap(Question::getQuestionId, Question::getQuestionText));
        ResultDTO resultDTO = new ResultDTO();
        resultDTO.setAttemptId(attempt.getAttemptId());
        resultDTO.setUserId(user.getUserId());
        resultDTO.setUserName(user.getUsername());
        resultDTO.setQuizId(quiz.getQuizId());
        resultDTO.setQuizTitle(quiz.getTitle());
        resultDTO.setScore(attempt.getScore());
        resultDTO.setTimestamp(attempt.getTimestamp());
        resultDTO.setUserAnswers(attempt.getAnswersAsMap());
        resultDTO.setCorrectAnswers(correctAnswersMap);
        resultDTO.setQuestionTexts(questionTextsMap);
        resultDTO.setTotalQuestions(questions.size());
        return resultDTO;
    }

    public List<ResultDTO> getResultsByUserId(Long userId) {
        List<Attempt> attempts = attemptRepository.findByUser_UserId(userId);
        return attempts.stream()
                .map(this::mapAttemptToResultDTO)
                .collect(Collectors.toList());
    }

    public List<ResultDTO> getResultsByQuizId(Long quizId) {
        List<Attempt> attempts = attemptRepository.findByQuiz_QuizId(quizId);
        return attempts.stream()
                .map(this::mapAttemptToResultDTO)
                .collect(Collectors.toList());
    }

    private ResultDTO mapAttemptToResultDTO(Attempt attempt) {
        Quiz quiz = attempt.getQuiz();
        Account user = attempt.getUser();
        List<Question> questions = questionRepository.findByQuiz_QuizId(quiz.getQuizId());
        Map<Long, String> correctAnswersMap = questions.stream()
                .collect(Collectors.toMap(Question::getQuestionId, Question::getCorrectAnswer));
        Map<Long, String> questionTextsMap = questions.stream()
                .collect(Collectors.toMap(Question::getQuestionId, Question::getQuestionText));
        ResultDTO resultDTO = new ResultDTO();
        resultDTO.setAttemptId(attempt.getAttemptId());
        resultDTO.setUserId(user.getUserId());
        resultDTO.setUserName(user.getUsername());
        resultDTO.setQuizId(quiz.getQuizId());
        resultDTO.setQuizTitle(quiz.getTitle());
        resultDTO.setScore(attempt.getScore());
        resultDTO.setTimestamp(attempt.getTimestamp());
        resultDTO.setUserAnswers(attempt.getAnswersAsMap());
        resultDTO.setCorrectAnswers(correctAnswersMap);
        resultDTO.setQuestionTexts(questionTextsMap);
        resultDTO.setTotalQuestions(questions.size());
        return resultDTO;
    }
}