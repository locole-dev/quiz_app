package com.dailycodework.quizonline.service.impl;

import com.dailycodework.quizonline.dto.QuestionDTO;
import com.dailycodework.quizonline.model.Question;
import com.dailycodework.quizonline.model.Quiz;
import com.dailycodework.quizonline.repository.QuestionRepository;
import com.dailycodework.quizonline.repository.QuizRepository;
import com.dailycodework.quizonline.service.IQuestionService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements IQuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private ModelMapper modelMapper;

    public QuestionDTO createQuestion(QuestionDTO questionDTO) throws Exception {
        Quiz quiz = quizRepository.findById(questionDTO.getQuizId())
                .orElseThrow(() -> new Exception("Quiz not found with id: " + questionDTO.getQuizId()));
        Question question = modelMapper.map(questionDTO, Question.class);
        question.setQuiz(quiz);
        question.setOptionsFromMap(questionDTO.getOptions());
        Question savedQuestion = questionRepository.save(question);
        QuestionDTO savedQuestionDTO = modelMapper.map(savedQuestion, QuestionDTO.class);
        savedQuestionDTO.setOptions(savedQuestion.getOptionsAsMap());
        return savedQuestionDTO;
    }

    public QuestionDTO getQuestionById(Long id) throws Exception {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new Exception("Quiz not found with id: " + id));
        QuestionDTO questionDTO = modelMapper.map(question, QuestionDTO.class);
        questionDTO.setOptions(question.getOptionsAsMap());
        return questionDTO;
    }

    public List<QuestionDTO> getQuestionsByQuizId(Long quizId) {
        List<Question> questions = questionRepository.findByQuiz_QuizId(quizId);
        return questions.stream()
                .map(question -> {
                    QuestionDTO dto = modelMapper.map(question, QuestionDTO.class);
                    dto.setOptions(question.getOptionsAsMap());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public QuestionDTO updateQuestion(Long id, QuestionDTO questionDTO) throws Exception {
        Question existingQuestion = questionRepository.findById(id)
                .orElseThrow(() -> new Exception("Quiz not found with id: " + id));
        Quiz quiz = quizRepository.findById(questionDTO.getQuizId())
                .orElseThrow(() -> new Exception("Quiz not found with id: " + questionDTO.getQuizId()));
        existingQuestion.setQuiz(quiz);
        existingQuestion.setQuestionText(questionDTO.getQuestionText());
        existingQuestion.setOptionsFromMap(questionDTO.getOptions());
        existingQuestion.setCorrectAnswer(questionDTO.getCorrectAnswer());
        Question updatedQuestion = questionRepository.save(existingQuestion);
        QuestionDTO updatedQuestionDTO = modelMapper.map(updatedQuestion, QuestionDTO.class);
        updatedQuestionDTO.setOptions(updatedQuestion.getOptionsAsMap());
        return updatedQuestionDTO;
    }

    public void deleteQuestion(Long id) throws Exception {
        if (!questionRepository.existsById(id)) {
            throw new Exception("Question not found with id: " + id);
        }
        questionRepository.deleteById(id);
    }
}