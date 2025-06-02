import api from "../../utils/api.js";

const ResultService = {
    /**
     * Lấy chi tiết kết quả của một bài làm cụ thể.
     * @param {string|number} attemptId - ID của bài làm
     * @returns {Promise} Promise chứa response từ API
     */
    getResultByAttemptId: (attemptId) => api.get(`/results/attempt/${attemptId}`),

    /**
     * Lấy danh sách tất cả các kết quả của một người dùng.
     * @param {string|number} userId - ID của người dùng
     * @returns {Promise} Promise chứa response từ API
     */
    getResultsByUserId: (userId) => api.get(`/results/user/${userId}`),

    /**
     * Lấy danh sách tất cả các kết quả cho một Quiz cụ thể (dành cho admin/teacher).
     * @param {string|number} quizId - ID của Quiz
     * @returns {Promise} Promise chứa response từ API
     */
    getResultsByQuizId: (quizId) => api.get(`/results/quiz/${quizId}`),

    // TODO: Nếu bạn triển khai API export ở backend, hãy thêm phương thức tại đây.
    // Ví dụ:
    // exportQuizResults: (quizId) => api.get(`/results/quiz/${quizId}/export/csv`, { responseType: 'blob' }),
};

export default ResultService;