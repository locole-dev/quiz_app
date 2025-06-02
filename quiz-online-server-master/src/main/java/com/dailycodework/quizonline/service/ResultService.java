package com.dailycodework.quizonline.service;

import com.dailycodework.quizonline.dto.ResultDTO;
import java.util.List;

public interface ResultService {
    ResultDTO getResultByAttemptId(Long attemptId) throws Exception;
    List<ResultDTO> getResultsByUserId(Long userId);
    List<ResultDTO> getResultsByQuizId(Long quizId);
    // Optionally add export methods if needed in the future
}