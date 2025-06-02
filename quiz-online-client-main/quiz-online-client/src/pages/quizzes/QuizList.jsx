import { useEffect, useState } from 'react';
        import { Link } from 'react-router-dom';
        import { Button, Card, Col, Empty, message, Popconfirm, Row, Spin, Space, Tag } from 'antd';
        import { DeleteOutlined, EditOutlined, PlusOutlined, QuestionCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
        import QuizService from "../../service/quizService.js";
        import useAuthStore from "../../store/authStore.js";

        function QuizList() {
            const [quizzes, setQuizzes] = useState([]);
            const [loading, setLoading] = useState(true);
            const [error, setError] = useState(null);

            const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
            const currentUser = useAuthStore((state) => state.currentUser);
            const isAdmin = isAuthenticated && currentUser?.role === 'ADMIN';

            useEffect(() => {
                QuizService.getAllQuizzes()
                    .then(response => {
                        let filteredQuizzes = response.data;

                        if (!isAdmin) {
                            const now = new Date();
                            filteredQuizzes = response.data.filter(quiz => {
                                const startTime = quiz.startTime ? new Date(quiz.startTime) : null;
                                const endTime = quiz.endTime ? new Date(quiz.endTime) : null;
                                // Quiz is active if current time is between start and end time
                                return (startTime && startTime <= now) && (!endTime || endTime >= now);
                            });
                        }
                        setQuizzes(filteredQuizzes);
                        setLoading(false);
                    })
                    .catch(err => {
                        console.error("Failed to fetch quizzes:", err);
                        message.error("Failed to load quiz list.");
                        setError("An error occurred while loading data.");
                        setLoading(false);
                    });
            }, [isAdmin]);

            const handleDelete = (id) => {
                QuizService.deleteQuiz(id)
                    .then(() => {
                        setQuizzes(quizzes.filter(quiz => quiz.quizId !== id));
                        message.success("Quiz deleted successfully!");
                    })
                    .catch(err => {
                        console.error("Failed to delete quiz:", err);
                        message.error("Failed to delete quiz.");
                    });
            };

            if (loading) {
                return <Spin tip="Loading quiz list..." size="large" className="flex justify-center items-center h-64" />;
            }
            if (error) {
                return <div className="text-center text-red-500 text-lg mt-8">{error}</div>;
            }

            return (
                <div style={{ padding: '24px' }}>
                    <h1 style={{ fontSize: '2em', marginBottom: '20px' }}>
                        {isAdmin ? 'Quiz List Management (Admin)' : 'Quiz List'}
                    </h1>

                    {isAdmin && (
                        <Link to="/quizzes/new">
                            <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: '20px' }}>
                                Create New Quiz
                            </Button>
                        </Link>
                    )}

                    {quizzes.length === 0 ? (
                        <Empty description={isAdmin ? "No quizzes have been created yet." : "No available quizzes to take."} />
                    ) : (
                        <Row gutter={[16, 16]}>
                            {quizzes.map(quiz => (
                                <Col xs={24} sm={12} lg={8} key={quiz.quizId}>
                                    <Card
                                        title={quiz.title}
                                        extra={
                                            <Link to={`/quizzes/${quiz.quizId}`}>
                                                <Button type="link">
                                                    {isAdmin ? 'Admin Details' : 'Quiz Details'}
                                                </Button>
                                            </Link>
                                        }
                                        actions={
                                            isAdmin ? (
                                                [
                                                    <Link key="edit" to={`/quizzes/${quiz.quizId}/edit`}>
                                                        <EditOutlined /> Edit
                                                    </Link>,
                                                    <Popconfirm
                                                        key="delete"
                                                        title="Are you sure you want to delete this quiz?"
                                                        onConfirm={() => handleDelete(quiz.quizId)}
                                                        okText="Yes"
                                                        cancelText="No"
                                                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                                    >
                                                        <span>
                                                            <DeleteOutlined /> Delete
                                                        </span>
                                                    </Popconfirm>,
                                                    <Link key="questions" to={`/quizzes/${quiz.quizId}/questions`}>
                                                        <QuestionCircleOutlined /> Manage Q.
                                                    </Link>
                                                ]
                                            ) : (
                                                isAuthenticated ? (
                                                    [
                                                        <Link key="start-quiz" to={`/take-quiz/${quiz.quizId}`}>
                                                            <Button type="text" icon={<PlayCircleOutlined />}>Start Quiz</Button>
                                                        </Link>,
                                                    ]
                                                ) : (
                                                    [
                                                        <Space key="login-to-take">
                                                            <Link to="/login">
                                                                <Button type="primary">Login to take quiz</Button>
                                                            </Link>
                                                        </Space>
                                                    ]
                                                )
                                            )
                                        }
                                    >
                                        <p><strong>Description:</strong> {quiz.description}</p>
                                        <p><strong>Duration:</strong> {quiz.duration / 60} minutes</p>
                                        <p><strong>Start:</strong> {quiz.startTime ? new Date(quiz.startTime).toLocaleString() : 'N/A'}</p>
                                        <p><strong>End:</strong> {quiz.endTime ? new Date(quiz.endTime).toLocaleString() : 'N/A'}</p>
                                        {isAdmin && quiz.status && <p><strong>Status:</strong> <Tag color="blue">{quiz.status}</Tag></p>}
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </div>
            );
        }

        export default QuizList;