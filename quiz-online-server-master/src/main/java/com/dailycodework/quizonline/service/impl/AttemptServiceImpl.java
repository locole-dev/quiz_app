package com.dailycodework.quizonline.service.impl;

import com.dailycodework.quizonline.dto.AttemptDTO;
import com.dailycodework.quizonline.dto.UserAnswerDTO;
import com.dailycodework.quizonline.model.Account;
import com.dailycodework.quizonline.model.Attempt;
import com.dailycodework.quizonline.model.Question;
import com.dailycodework.quizonline.model.Quiz;
import com.dailycodework.quizonline.repository.AccountRepository;
import com.dailycodework.quizonline.repository.AttemptRepository;
import com.dailycodework.quizonline.repository.QuestionRepository;
import com.dailycodework.quizonline.repository.QuizRepository;
import com.dailycodework.quizonline.service.AccountService;
import com.dailycodework.quizonline.service.AttemptService;
import jakarta.transaction.Transactional;
import org.apache.catalina.User;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AttemptServiceImpl implements AttemptService {

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

    @Transactional
    public AttemptDTO submitQuiz(UserAnswerDTO userAnswerDTO) throws Exception {
        Quiz quiz = quizRepository.findById(userAnswerDTO.getQuizId())
                .orElseThrow(() -> new Exception("Quiz not found with id: " + userAnswerDTO.getQuizId()));

        Account user = userRepository.findById(Math.toIntExact(userAnswerDTO.getUserId()))
                .orElseThrow(() -> new Exception("User not found with id: " + userAnswerDTO.getUserId()));
        LocalDateTime now = LocalDateTime.now();
        if ((quiz.getStartTime() != null && now.isBefore(quiz.getStartTime())) ||
                (quiz.getEndTime() != null && now.isAfter(quiz.getEndTime()))) {
            throw new IllegalArgumentException("Quiz is not active at this moment.");
        }
        List<Question> questions = questionRepository.findByQuiz_QuizId(quiz.getQuizId());
        Map<Long, String> correctAnswersMap = questions.stream()
                .collect(Collectors.toMap(Question::getQuestionId, Question::getCorrectAnswer));

        int score = 0;
        if (userAnswerDTO.getAnswers() != null) {
            for (Map.Entry<Long, String> entry : userAnswerDTO.getAnswers().entrySet()) {
                Long questionId = entry.getKey();
                String userAnswer = entry.getValue();
                String correctAnswer = correctAnswersMap.get(questionId);

                if (correctAnswer != null && userAnswer != null && userAnswer.equalsIgnoreCase(correctAnswer)) {
                    score++;
                }
            }
        }

        Attempt attempt = new Attempt();
        attempt.setQuiz(quiz);
        attempt.setUser(user);
        attempt.setAnswersFromMap(userAnswerDTO.getAnswers());
        attempt.setScore(score);
        attempt.setTimestamp(LocalDateTime.now());

        Attempt savedAttempt = attemptRepository.save(attempt);

        AttemptDTO attemptDTO = modelMapper.map(savedAttempt, AttemptDTO.class);
        attemptDTO.setAnswers(savedAttempt.getAnswersAsMap());
        return attemptDTO;
    }

    public AttemptDTO getAttemptById(Long id) throws Exception {
        Attempt attempt = attemptRepository.findById(id)
                .orElseThrow(() -> new Exception("Attempt not found with id: " + id));
        AttemptDTO attemptDTO = modelMapper.map(attempt, AttemptDTO.class);
        attemptDTO.setAnswers(attempt.getAnswersAsMap());
        return attemptDTO;
    }

    public List<AttemptDTO> getAttemptsByUserId(Long userId) {
        List<Attempt> attempts = attemptRepository.findByUser_UserId(userId);
        return attempts.stream()
                .map(attempt -> {
                    AttemptDTO dto = modelMapper.map(attempt, AttemptDTO.class);
                    dto.setAnswers(attempt.getAnswersAsMap());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public List<AttemptDTO> getAttemptsByQuizId(Long quizId) {
        List<Attempt> attempts = attemptRepository.findByQuiz_QuizId(quizId);
        return attempts.stream()
                .map(attempt -> {
                    AttemptDTO dto = modelMapper.map(attempt, AttemptDTO.class);
                    dto.setAnswers(attempt.getAnswersAsMap());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}