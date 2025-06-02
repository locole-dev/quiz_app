import api from "../../utils/api.js";


const QuestionService = {
    /**
     * Tạo một câu hỏi mới.
     * @param {object} questionData - Dữ liệu câu hỏi (quizId, questionText, options, correctAnswer)
     * @returns {Promise} Promise chứa response từ API
     */
    createQuestion: (questionData) => api.post('/questions', questionData),

    /**
     * Lấy thông tin chi tiết của một câu hỏi theo ID.
     * @param {string|number} id - ID của câu hỏi
     * @returns {Promise} Promise chứa response từ API
     */
    getQuestionById: (id) => api.get(`/questions/${id}`),

    /**
     * Lấy danh sách tất cả các câu hỏi thuộc một Quiz cụ thể.
     * @param {string|number} quizId - ID của Quiz
     * @returns {Promise} Promise chứa response từ API
     */
    getQuestionsByQuizId: (quizId) => api.get(`/questions/quiz/${quizId}`),

    /**
     * Cập nhật thông tin của một câu hỏi.
     * @param {string|number} id - ID của câu hỏi cần cập nhật
     * @param {object} questionData - Dữ liệu câu hỏi cập nhật
     * @returns {Promise} Promise chứa response từ API
     */
    updateQuestion: (id, questionData) => api.put(`/questions/${id}`, questionData),

    /**
     * Xóa một câu hỏi theo ID.
     * @param {string|number} id - ID của câu hỏi cần xóa
     * @returns {Promise} Promise chứa response từ API
     */
    deleteQuestion: (id) => api.delete(`/questions/${id}`),
};

export default QuestionService;