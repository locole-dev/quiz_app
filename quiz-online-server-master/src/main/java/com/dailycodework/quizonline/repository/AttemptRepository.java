package com.dailycodework.quizonline.repository;

import com.dailycodework.quizonline.model.Attempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttemptRepository extends JpaRepository<Attempt, Long> {
    List<Attempt> findByUser_UserId(Long userId);
    List<Attempt> findByQuiz_QuizId(Long quizId);
    List<Attempt> findByUser_UserIdAndQuiz_QuizId(Long userId, Long quizId);
}