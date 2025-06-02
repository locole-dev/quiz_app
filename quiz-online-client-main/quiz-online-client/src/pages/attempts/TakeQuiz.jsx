import {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Button, Card, message, Modal, Radio, Space, Spin, Typography} from 'antd';
import QuizService from "../../service/quizService.js";
import QuestionService from "../../service/questionService.js";
import AttemptService from "../../service/attemptService.js";
import useAuthStore from "../../store/authStore.js";

const {Title, Text} = Typography;

function TakeQuiz() {
    const {quizId} = useParams();
    const navigate = useNavigate();
    const currentUser = useAuthStore((state) => state.currentUser);
    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const timerRef = useRef(null);

    const currentUserId = currentUser?.userId;

    // Format seconds to MM:SS
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Submit quiz (manual or timeout)
    const submitQuiz = async (isTimeout = false) => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        setLoading(true);
        setError(null);
        try {
            const submitData = {
                quizId: quiz.quizId,
                userId: currentUserId,
                answers: userAnswers,
            };
            const response = await AttemptService.submitQuiz(submitData);
            message.success(`Quiz submitted successfully! Your score is: ${response.data.score}. ${isTimeout ? '(Time expired)' : ''}`);
            navigate(`/results/${response.data.attemptId}`);
        } catch (err) {
            message.error(`An error occurred while submitting: ${err.response?.data?.message || err.message}`);
            setError("An error occurred while submitting. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                const quizRes = await QuizService.getQuizById(quizId);
                setQuiz(quizRes.data);

                if (quizRes.data.duration) {
                    setTimeLeft(quizRes.data.duration);
                }

                const questionRes = await QuestionService.getQuestionsByQuizId(quizId);
                setQuestions(questionRes.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch quiz or questions:", err);
                message.error("Failed to load quiz or question information.");
                setError("An error occurred while loading data.");
                setLoading(false);
            }
        };
        fetchQuizData();
    }, [quizId]);

    // Countdown timer logic
    useEffect(() => {
        if (quiz && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(timerRef.current);
                        timerRef.current = null;
                        Modal.warning({
                            title: 'Time Expired!',
                            content: 'Your time for this quiz has run out. Your answers will be submitted automatically.',
                            okText: 'OK',
                            onOk: () => submitQuiz(true),
                            closable: false,
                            maskClosable: false,
                        });
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [quiz, timeLeft]);

    const handleAnswerChange = (questionId, answer) => {
        setUserAnswers(prev => ({
            ...prev,
            [questionId]: answer,
        }));
    };

    const handleConfirmSubmit = () => {
        Modal.confirm({
            title: 'Submit Confirmation',
            content: 'Are you sure you want to submit? You will not be able to change your answers afterwards.',
            okText: 'Submit',
            cancelText: 'Cancel',
            onOk: () => submitQuiz(false),
        });
    };

    if (loading) {
        return <Spin tip="Loading quiz..." size="large" className="flex justify-center items-center h-64"/>;
    }
    if (error) {
        return <div className="text-center text-red-500 text-lg mt-8">{error}</div>;
    }
    if (!quiz) {
        return <div className="text-center text-red-500 text-lg mt-8">Quiz not found.</div>;
    }

    return (
        <div style={{padding: '24px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                <Title level={2} style={{margin: 0}}>Take Quiz: {quiz.title}</Title>
                <Card style={{padding: '5px 15px', borderRadius: '8px', backgroundColor: '#f0f2f5'}}>
                    <Title level={4} style={{margin: 0, color: timeLeft <= 60 ? 'red' : 'blue'}}>
                        Time left: {formatTime(timeLeft)}
                    </Title>
                </Card>
            </div>
            <p style={{marginBottom: '20px', color: '#666'}}>{quiz.description}</p>
            <p style={{marginBottom: '20px', color: '#666'}}>
                Duration: <b>{quiz.duration} minutes</b>
            </p>

            <Space direction="vertical" size={24} style={{width: '100%'}}>
                {questions.map((question, index) => (
                    <Card key={question.questionId} title={`Question ${index + 1}: ${question.questionText}`}>
                        <Radio.Group
                            onChange={(e) => handleAnswerChange(question.questionId, e.target.value)}
                            value={userAnswers[question.questionId]}
                        >
                            <Space direction="vertical">
                                {question.options && Object.entries(question.options).map(([key, value]) => (
                                    <Radio key={key} value={key}>
                                        {key}: {value}
                                    </Radio>
                                ))}
                            </Space>
                        </Radio.Group>
                    </Card>
                ))}
            </Space>

            <Button
                type="primary"
                size="large"
                style={{marginTop: '30px'}}
                onClick={handleConfirmSubmit}
                loading={loading}
                disabled={timeLeft === 0}
            >
                Submit
            </Button>
        </div>
    );
}

export default TakeQuiz;