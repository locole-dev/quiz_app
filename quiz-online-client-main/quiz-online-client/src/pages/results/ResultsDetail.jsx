import React, { useEffect, useState, useRef } from 'react'; // Import useRef
import { useParams } from 'react-router-dom';
import { Card, Descriptions, message, Spin, Tag, Typography, Button, Space } from 'antd'; // Thêm Button, Space
import { DownloadOutlined } from '@ant-design/icons'; // Thêm icon Download
import ResultService from "../../service/resultService.js";

import html2canvas from 'html2canvas'; // Import html2canvas
import jsPDF from 'jspdf';           // Import jspdf

const { Title, Text } = Typography;

function ResultDetail() {
    const { attemptId } = useParams();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Tạo một ref để tham chiếu đến phần tử DOM mà bạn muốn export
    const contentRef = useRef(null);

    useEffect(() => {
        ResultService.getResultByAttemptId(attemptId)
            .then(response => {
                setResult(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load result details:", err.response?.data?.detailMessage || err.message);
                message.error("Failed to load result details."); // Sửa thông báo lỗi chung hơn
                setError("An error occurred while loading data.");
                setLoading(false);
            });
    }, [attemptId]);

    // Hàm xử lý xuất PDF
    const handleExportPdf = async () => {
        if (!contentRef.current) {
            message.error("Could not find content to export.");
            return;
        }

        message.info("Generating PDF, please wait...");
        try {
            const canvas = await html2canvas(contentRef.current, {
                scale: 2, // Tăng scale để PDF có chất lượng tốt hơn
                useCORS: true, // Quan trọng nếu có hình ảnh từ các domain khác
                windowWidth: document.querySelector('.ant-layout-content')?.scrollWidth, // Đảm bảo chụp đúng chiều rộng nếu có responsive layout
                windowHeight: document.querySelector('.ant-layout-content')?.scrollHeight // Đảm bảo chụp đúng chiều cao
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4'); // 'p' for portrait, 'mm' for units, 'a4' for page size
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`Quiz_Result_${result.quizTitle.replace(/\s/g, '_')}_${result.userName}.pdf`);
            message.success("PDF exported successfully!");
        } catch (err) {
            console.error("Error generating PDF:", err);
            message.error("Failed to export PDF. Please try again.");
        }
    };


    if (loading) {
        return <Spin tip="Loading result..." size="large" className="flex justify-center items-center h-64" />;
    }
    if (error) {
        return <div className="text-center text-red-500 text-lg mt-8">{error}</div>;
    }
    if (!result) {
        return <div className="text-center text-red-500 text-lg mt-8">Result not found.</div>;
    }

    return (
        <div style={{ padding: '24px' }}>
            <Space align="center" style={{ marginBottom: '20px', width: '100%', justifyContent: 'space-between' }}>
                <Title level={2} style={{ margin: 0 }}>Quiz Result: {result.quizTitle}</Title>
                <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={handleExportPdf}
                >
                    Export to PDF
                </Button>
            </Space>

            {/* Gán ref vào phần tử chứa nội dung bạn muốn export */}
            <div ref={contentRef} style={{ background: '#fff', padding: '24px', borderRadius: '8px' }}>
                <Descriptions bordered column={1} style={{ marginBottom: '30px' }}>
                    <Descriptions.Item label="User">{result.userName}</Descriptions.Item>
                    <Descriptions.Item
                        label="Submitted At">{new Date(result.timestamp).toLocaleString()}</Descriptions.Item>
                    <Descriptions.Item label="Score">
                        <Text strong style={{
                            fontSize: '1.5em',
                            color: result.score >= result.totalQuestions / 2 ? 'green' : 'red'
                        }}>
                            {result.score}
                        </Text> / {result.totalQuestions}
                    </Descriptions.Item>
                </Descriptions>

                <Title level={3} style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px'}}>Answer Details</Title>

                {Object.keys(result.questionTexts).map(questionId => {
                    const qText = result.questionTexts[questionId];
                    const userAnswer = result.userAnswers ? result.userAnswers[questionId] : null;
                    const correctAnswer = result.correctAnswers ? result.correctAnswers[questionId] : null;
                    const isCorrect = userAnswer && correctAnswer && userAnswer.toLowerCase() === correctAnswer.toLowerCase();

                    return (
                        <Card
                            key={questionId}
                            style={{ marginBottom: '16px', borderColor: isCorrect ? '#d9f7be' : '#ffe7ba' }}
                            bodyStyle={{ backgroundColor: isCorrect ? '#f6ffed' : '#fff1e5' }}
                        >
                            <Title level={4} style={{ margin: 0 }}>
                                {qText}
                                <Tag color={isCorrect ? 'green' : 'red'} style={{ marginLeft: '10px' }}>
                                    {isCorrect ? 'Correct' : 'Incorrect'}
                                </Tag>
                            </Title>
                            <p style={{ marginTop: '10px' }}>
                                <Text strong>Your answer:</Text> {userAnswer || "(No answer)"}
                            </p>
                            {!isCorrect && (
                                <p>
                                    <Text strong>Correct answer:</Text> <Text type="success">{correctAnswer}</Text>
                                </p>
                            )}
                        </Card>
                    );
                })}
            </div> {/* Kết thúc phần tử được export */}
        </div>
    );
}

export default ResultDetail;