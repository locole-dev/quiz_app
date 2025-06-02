import api from "../../utils/api.js";


const AttemptService = {
    /**
     * Gửi bài làm Quiz của người dùng.
     * @param {object} userAnswerData - Dữ liệu bài làm (quizId, userId, answers: {questionId: userAnswer})
     * @returns {Promise} Promise chứa response từ API (bao gồm điểm số)
     */
    submitQuiz: (userAnswerData) => api.post('/attempts/submit', userAnswerData),

    /**
     * Lấy thông tin chi tiết của một bài làm theo ID.
     * @param {string|number} id - ID của bài làm
     * @returns {Promise} Promise chứa response từ API
     */
    getAttemptById: (id) => api.get(`/attempts/${id}`),

    /**
     * Lấy danh sách tất cả các bài làm của một người dùng cụ thể.
     * @param {string|number} userId - ID của người dùng
     * @returns {Promise} Promise chứa response từ API
     */
    getAttemptsByUserId: (userId) => api.get(`/attempts/user/${userId}`),

    /**
     * Lấy danh sách tất cả các bài làm cho một Quiz cụ thể.
     * @param {string|number} quizId - ID của Quiz
     * @returns {Promise} Promise chứa response từ API
     */
    getAttemptsByQuizId: (quizId) => api.get(`/attempts/quiz/${quizId}`),
};

export default AttemptService;