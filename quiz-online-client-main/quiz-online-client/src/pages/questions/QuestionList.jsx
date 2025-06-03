import {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {Button, Card, Empty, message, Popconfirm, Spin} from 'antd';
import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    QuestionCircleOutlined as AntdQuestionCircleOutlined
} from '@ant-design/icons';
import QuizService from "../../service/quizService.js";
import QuestionService from "../../service/questionService.js";

function QuestionList() {
    const {quizId} = useParams();
    const [questions, setQuestions] = useState([]);
    const [quizTitle, setQuizTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const quizRes = await QuizService.getQuizById(quizId);
                setQuizTitle(quizRes.data.title);

                const questionRes = await QuestionService.getQuestionsByQuizId(quizId);
                setQuestions(questionRes.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch data:", err);
                message.error("Failed to load quiz or question information.");
                setError("An error occurred while loading data.");
                setLoading(false);
            }
        };
        fetchData();
    }, [quizId]);

    const handleDelete = (id) => {
        QuestionService.deleteQuestion(id)
            .then(() => {
                setQuestions(questions.filter(q => q.questionId !== id));
                message.success("Question deleted successfully!");
            })
            .catch(err => {
                console.error("Failed to delete question:", err);
                message.error("Failed to delete question.");
            });
    };

    if (loading) {
        return <Spin tip="Loading questions..." size="large" className="flex justify-center items-center h-64"/>;
    }
    if (error) {
        return <div className="text-center text-red-500 text-lg mt-8">{error}</div>;
    }

    return (
        <div style={{padding: '24px'}}>
            <h1 style={{fontSize: '2em', marginBottom: '20px'}}>
                Questions for Quiz: {quizTitle}
            </h1>
            <Link to={`/quizzes/${quizId}/questions/new`}>
                <Button type="primary" icon={<PlusOutlined/>} style={{marginBottom: '20px'}}>
                    Add New Question
                </Button>
            </Link>
            <Link to={`/quizzes`} style={{marginLeft: '10px'}}>
                <Button>
                    Back to Quiz List
                </Button>
            </Link>

            {questions.length === 0 ? (
                <Empty description="No questions for this quiz yet."/>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '16px'
                }}>
                    {questions.map((question, index) => (
                        <Card
                            key={question.questionId}
                            title={`Question ${index + 1}: ${question.questionText}`}
                            actions={[
                               <Link key="edit" to={`/quizzes/${quizId}/questions/${question.questionId}/edit`}>
                                    <EditOutlined /> Edit
                                </Link>,
                                <Popconfirm
                                    key="delete"
                                    title="Are you sure you want to delete this question?"
                                    onConfirm={() => handleDelete(question.questionId)}
                                    okText="Yes"
                                    cancelText="No"
                                    icon={<AntdQuestionCircleOutlined style={{color: 'red'}}/>}
                                >
                                        <span>
                                            <DeleteOutlined/> Delete
                                        </span>
                                </Popconfirm>,
                            ]}
                        >
                            <p><strong>Options:</strong></p>
                            <ul>
                                {question.options && Object.entries(question.options).map(([key, value]) => (
                                    <li key={key}><strong>{key}:</strong> {value}</li>
                                ))}
                            </ul>
                            <p style={{marginTop: '10px'}}>
                                <strong>Correct Answer:</strong> <span
                                style={{color: 'green', fontWeight: 'bold'}}>{question.correctAnswer}</span>
                            </p>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

export default QuestionList;