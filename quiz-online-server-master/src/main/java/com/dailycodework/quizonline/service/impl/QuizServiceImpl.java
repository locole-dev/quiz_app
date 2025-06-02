package com.dailycodework.quizonline.service.impl;

    import com.dailycodework.quizonline.dto.QuizDTO;
    import com.dailycodework.quizonline.model.Quiz;
    import com.dailycodework.quizonline.repository.QuizRepository;
    import com.dailycodework.quizonline.service.QuizService;
    import org.modelmapper.ModelMapper;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.stereotype.Service;

    import java.time.LocalDateTime;
    import java.util.List;
    import java.util.stream.Collectors;

    @Service
    public class QuizServiceImpl implements QuizService {
        @Autowired
        private QuizRepository quizRepository;

        @Autowired
        private ModelMapper modelMapper;

        @Override
        public QuizDTO createQuiz(QuizDTO quizDTO) {
            Quiz quiz = modelMapper.map(quizDTO, Quiz.class);
            Quiz savedQuiz = quizRepository.save(quiz);
            return modelMapper.map(savedQuiz, QuizDTO.class);
        }

        @Override
        public QuizDTO getQuizById(Long id) throws Exception {
            Quiz quiz = quizRepository.findById(id)
                    .orElseThrow(() -> new Exception("Quiz not found with id: " + id));
            return modelMapper.map(quiz, QuizDTO.class);
        }

        @Override
        public List<QuizDTO> getAllQuizes() {
            List<Quiz> quizzes = quizRepository.findAll();
            return quizzes.stream()
                    .map(quiz -> modelMapper.map(quiz, QuizDTO.class))
                    .collect(Collectors.toList());
        }

        @Override
        public QuizDTO updateQuiz(Long id, QuizDTO quizDTO) throws Exception {
            Quiz existingQuiz = quizRepository.findById(id)
                    .orElseThrow(() -> new Exception("Quiz not found with id: " + id));
            existingQuiz.setTitle(quizDTO.getTitle());
            existingQuiz.setDescription(quizDTO.getDescription());
            existingQuiz.setStartTime(quizDTO.getStartTime());
            existingQuiz.setEndTime(quizDTO.getEndTime());
            Quiz updatedQuiz = quizRepository.save(existingQuiz);
            return modelMapper.map(updatedQuiz, QuizDTO.class);
        }

        @Override
        public void deleteQuiz(Long id) throws Exception {
            if (!quizRepository.existsById(id)) {
                throw new Exception("Quiz not found with id: " + id);
            }
            quizRepository.deleteById(id);
        }

        @Override
        public List<QuizDTO> getActiveQuizes() {
            LocalDateTime now = LocalDateTime.now();
            List<Quiz> activeQuizzes = quizRepository.findAll().stream()
                    .filter(quiz -> (quiz.getStartTime() == null || quiz.getStartTime().isBefore(now)) &&
                            (quiz.getEndTime() == null || quiz.getEndTime().isAfter(now)))
                    .collect(Collectors.toList());
            return activeQuizzes.stream()
                    .map(quiz -> modelMapper.map(quiz, QuizDTO.class))
                    .collect(Collectors.toList());
        }
    }