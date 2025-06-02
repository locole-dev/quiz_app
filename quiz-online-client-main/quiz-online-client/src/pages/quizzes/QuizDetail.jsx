import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {Button, Card, Descriptions, message, Space, Spin} from 'antd';
import {EditOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import QuizService from "../../service/quizService.js";
import QuestionService from "../../service/questionService.js";

function QuizDetail() {
    const {id} = useParams();
    const [quiz, setQuiz] = useState(null);
    const [questionCount, setQuestionCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuizDetails = async () => {
            try {
                const quizRes = await QuizService.getQuizById(id);
                setQuiz(quizRes.data);

                const questionsRes = await QuestionService.getQuestionsByQuizId(id);
                setQuestionCount(questionsRes.data.length);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch quiz details:", err);
                message.error("Failed to load quiz details.");
                setError("An error occurred while loading data.");
                setLoading(false);
            }
        };
        fetchQuizDetails();
    }, [id]);

    if (loading) {
        return <Spin tip="Loading quiz details..." size="large"
                     style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '64vh'}}/>;
    }
    if (error) {
        return <div style={{textAlign: 'center', color: 'red', fontSize: '1.2em', marginTop: '20px'}}>{error}</div>;
    }
    if (!quiz) {
        return <div style={{textAlign: 'center', fontSize: '1.2em', marginTop: '20px'}}>Quiz not found.</div>;
    }

    const startTime = quiz.startTime ? new Date(quiz.startTime).toLocaleString() : 'N/A';
    const endTime = quiz.endTime ? new Date(quiz.endTime).toLocaleString() : 'N/A';

    return (
        <div style={{padding: '24px'}}>
            <Card
                title={quiz.title}
                extra={
                    <Space>
                        <Link to={`/quizzes/${quiz.quizId}/edit`}>
                            <Button type="default" icon={<EditOutlined/>}>
                                Edit Quiz
                            </Button>
                        </Link>
                        <Link to={`/quizzes/${quiz.quizId}/questions`}>
                            <Button icon={<QuestionCircleOutlined/>}>
                                Manage Questions
                            </Button>
                        </Link>
                    </Space>
                }
                style={{marginBottom: '20px'}}
            >
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Description">{quiz.description || 'No description'}</Descriptions.Item>
                    <Descriptions.Item label="Start Time">{startTime}</Descriptions.Item>
                    <Descriptions.Item label="End Time">{endTime}</Descriptions.Item>
                    <Descriptions.Item label="Number of Questions">{questionCount}</Descriptions.Item>
                </Descriptions>
                <div style={{marginTop: '20px', display: 'flex', justifyContent: 'space-between'}}>
                    <Link to={`/take-quiz/${quiz.quizId}`}>
                        <Button type="primary" size="large">
                            Take this Quiz
                        </Button>
                    </Link>
                    <Link to={`/quizzes`}>
                        <Button type="default">
                            Back to Quiz List
                        </Button>
                    </Link>
                </div>
            </Card>
        </div>
    );
}

export default QuizDetail;