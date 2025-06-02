// src/pages/attempts/UserAttempts.js
        import React, { useEffect, useState } from 'react';
        import { useParams, Link } from 'react-router-dom';
        import { Table, Spin, message, Tag, Empty, Space } from 'antd';
        import AttemptService from "../../service/attemptService.js";

        function UserAttempts() {
            const { userId } = useParams(); // Get userId from URL
            const [attempts, setAttempts] = useState([]);
            const [loading, setLoading] = useState(true);
            const [error, setError] = useState(null);

            useEffect(() => {
                AttemptService.getAttemptsByUserId(userId)
                    .then(response => {
                        setAttempts(response.data);
                        setLoading(false);
                    })
                    .catch(err => {
                        console.error("Failed to fetch user attempts:", err.detailMessage);
                        message.error("Failed to load your attempts: ",  err.detailMessage);
                        setError("An error occurred while loading data.");
                        setLoading(false);
                    });
            }, [userId]);

            const columns = [
                {
                    title: 'Quiz Title',
                    dataIndex: 'quizId', // Backend should return quizTitle in AttemptDTO
                    key: 'quizId',
                    render: (text, record) => <Link to={`/results/${record.attemptId}`}>{record.quizId}</Link>,
                },
                {
                    title: 'Score',
                    dataIndex: 'score',
                    key: 'score',
                    render: (score, record) => {
                        // Assume totalQuestions in AttemptDTO or get from ResultDetail
                        // Currently only displaying score
                        const isPassed = score > 0; // Adjust your pass/fail logic as needed
                        return <Tag color={isPassed ? 'green' : 'red'}>{score}</Tag>;
                    },
                },
                {
                    title: 'Submitted At',
                    dataIndex: 'timestamp',
                    key: 'timestamp',
                    render: (timestamp) => new Date(timestamp).toLocaleString(),
                },
                {
                    title: 'Action',
                    key: 'action',
                    render: (text, record) => (
                        <Space size="middle">
                            <Link to={`/results/${record.attemptId}`}>
                                View Details
                            </Link>
                        </Space>
                    ),
                },
            ];

            if (loading) {
                return <Spin tip="Loading your attempts..." size="large" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '64vh' }} />;
            }
            if (error) {
                return <div style={{ textAlign: 'center', color: 'red', fontSize: '1.2em', marginTop: '20px' }}>{error}</div>;
            }

            return (
                <div style={{ padding: '24px' }}>
                    <h1 style={{ fontSize: '2em', marginBottom: '20px' }}>My Attempts (User ID: {userId})</h1>
                    {attempts.length === 0 ? (
                        <Empty description="You have not taken any quizzes yet." />
                    ) : (
                        <Table columns={columns} dataSource={attempts} rowKey="attemptId" />
                    )}
                </div>
            );
        }

        export default UserAttempts;