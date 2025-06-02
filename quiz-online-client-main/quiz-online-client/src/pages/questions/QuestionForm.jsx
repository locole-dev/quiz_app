import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Button, Form, Input, message, Space, Spin} from 'antd';
import QuestionService from "../../service/questionService.js";

function QuestionForm() {
    const {quizId, id} = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            setLoading(true);
            QuestionService.getQuestionById(id)
                .then(response => {
                    const fetchedQuestion = response.data;
                    form.setFieldsValue({
                        questionText: fetchedQuestion.questionText,
                        optionA: fetchedQuestion.options?.A || '',
                        optionB: fetchedQuestion.options?.B || '',
                        optionC: fetchedQuestion.options?.C || '',
                        optionD: fetchedQuestion.options?.D || '',
                        correctAnswer: fetchedQuestion.correctAnswer,
                    });
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to fetch question for edit:", err);
                    message.error("Failed to load question information.");
                    setLoading(false);
                });
        }
    }, [id, form]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const questionDataToSend = {
                quizId: Number(quizId),
                questionText: values.questionText,
                options: {
                    A: values.optionA,
                    B: values.optionB,
                    C: values.optionC,
                    D: values.optionD,
                },
                correctAnswer: values.correctAnswer,
            };

            if (id) {
                await QuestionService.updateQuestion(id, questionDataToSend);
                message.success('Question updated successfully!');
            } else {
                await QuestionService.createQuestion(questionDataToSend);
                message.success('Question created successfully!');
            }
            navigate(`/quizzes/${quizId}/questions`);
        } catch (err) {
            console.error("Error saving question:", err.response ? err.response.data : err.message);
            message.error("An error occurred while saving the question. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading && id) {
        return <Spin tip="Loading question information..." size="large"
                     className="flex justify-center items-center h-64"/>;
    }

    return (
        <div style={{padding: '24px'}}>
            <h1 style={{fontSize: '2em', marginBottom: '20px'}}>{id ? 'Edit Question' : 'Add New Question'}</h1>
            <Spin spinning={loading}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        questionText: '',
                        optionA: '', optionB: '', optionC: '', optionD: '',
                        correctAnswer: '',
                    }}
                >
                    <Form.Item
                        label="Question Text"
                        name="questionText"
                        rules={[{required: true, message: 'Please enter the question text!'}]}
                    >
                        <Input.TextArea rows={3}/>
                    </Form.Item>

                    <h3 style={{fontSize: '1.2em', marginTop: '20px', marginBottom: '10px'}}>Options:</h3>
                    {['A', 'B', 'C', 'D'].map(key => (
                        <Form.Item
                            key={key}
                            label={`Option ${key}`}
                            name={`option${key}`}
                            rules={[{required: true, message: `Please enter option ${key}!`}]}
                        >
                            <Input placeholder={`Option ${key} text`}/>
                        </Form.Item>
                    ))}

                    <Form.Item
                        label="Correct Answer (e.g., A, B, C...)"
                        name="correctAnswer"
                        rules={[{required: true, message: 'Please enter the correct answer!'}]}
                    >
                        <Input placeholder="e.g., A"/>
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                {id ? 'Update Question' : 'Create Question'}
                            </Button>
                            <Button onClick={() => navigate(`/quizzes/${quizId}/questions`)}>Cancel</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Spin>
        </div>
    );
}

export default QuestionForm;