// src/pages/results/QuizResults.js
import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {Button, Empty, message, Space, Spin, Table, Tag} from 'antd';
import {FileExcelOutlined} from '@ant-design/icons';
import QuizService from "../../service/quizService.js";
import ResultService from "../../service/resultService.js";

function QuizResults() {
    const {quizId} = useParams();
    const [results, setResults] = useState([]);
    const [quizTitle, setQuizTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuizResults = async () => {
            try {
                const quizRes = await QuizService.getQuizById(quizId);
                setQuizTitle(quizRes.data.title);

                const resultsRes = await ResultService.getResultsByQuizId(quizId);
                setResults(resultsRes.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch quiz results:", err);
                message.error("Failed to load quiz results.");
                setError("An error occurred while loading data.");
                setLoading(false);
            }
        };
        fetchQuizResults();
    }, [quizId]);

    const columns = [
        {
            title: 'User Name',
            dataIndex: 'userName',
            key: 'userName',
            render: (text, record) => <Link to={`/results/${record.attemptId}`}>{record.userName}</Link>,
        },
        {
            title: 'Score',
            dataIndex: 'score',
            key: 'score',
            render: (score, record) => {
                const totalQuestions = record.totalQuestions || 1;
                const percentage = (score / totalQuestions) * 100;
                let color = 'red';
                if (percentage >= 80) color = 'green';
                else if (percentage >= 50) color = 'blue';

                return <Tag color={color}>{score} / {totalQuestions}</Tag>;
            },
            sorter: (a, b) => a.score - b.score,
        },
        {
            title: 'Submitted At',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (timestamp) => new Date(timestamp).toLocaleString(),
            sorter: (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
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

    const handleExport = () => {
        message.info('Export report feature is under development!');
        // Logic for exporting CSV/Excel will go here
    };

    if (loading) {
        return <Spin tip="Loading quiz results..." size="large"
                     style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '64vh'}}/>;
    }
    if (error) {
        return <div style={{textAlign: 'center', color: 'red', fontSize: '1.2em', marginTop: '20px'}}>{error}</div>;
    }

    return (
        <div style={{padding: '24px'}}>
            <h1 style={{fontSize: '2em', marginBottom: '20px'}}>Quiz Results: {quizTitle}</h1>
            <Space style={{marginBottom: '20px'}}>
                <Button type="primary" icon={<FileExcelOutlined/>} onClick={handleExport}>
                    Export Report (CSV/Excel)
                </Button>
                <Link to={`/quizzes`}>
                    <Button>
                        Back to Quiz List
                    </Button>
                </Link>
            </Space>

            {results.length === 0 ? (
                <Empty description="No submissions for this quiz yet."/>
            ) : (
                <Table columns={columns} dataSource={results} rowKey="attemptId"/>
            )}
        </div>
    );
}

export default QuizResults;