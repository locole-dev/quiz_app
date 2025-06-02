import api from "../../utils/api.js";


const QuizService = {
    getAllQuizzes: () => api.get('/quizzes'),
    getQuizById: (id) => api.get(`/quizzes/${id}`),
    createQuiz: (quizData) => api.post('/quizzes', quizData),
    updateQuiz: (id, quizData) => api.put(`/quizzes/${id}`, quizData),
    deleteQuiz: (id) => api.delete(`/quizzes/${id}`),
    getActiveQuizzes: () => api.get('/quizzes/active'),
};

export default QuizService;