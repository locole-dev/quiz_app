// src/components/PublicRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Spin } from 'antd'; // Để hiển thị trạng thái loading
import useAuthStore from '../store/authStore'; // Import Zustand store của bạn

function PublicRoute({ children }) {
    // Lấy trạng thái xác thực và loading từ Zustand store
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const loading = useAuthStore((state) => state.loading);

    // Nếu đang trong quá trình kiểm tra trạng thái xác thực, hiển thị loading
    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" tip="Đang kiểm tra phiên đăng nhập..." />
            </div>
        );
    }

    // Nếu người dùng ĐÃ đăng nhập (isAuthenticated là true),
    // chuyển hướng họ đến trang chính (ví dụ: "/") hoặc dashboard.
    // "replace" giúp thay thế entry hiện tại trong lịch sử trình duyệt, ngăn quay lại trang login.
    if (isAuthenticated) {
        return <Navigate to="/" replace />; // Thay đổi thành "/dashboard" nếu đó là trang chính sau khi đăng nhập
    }

    // Nếu người dùng CHƯA đăng nhập, cho phép họ truy cập component con
    // (tức là LoginPage hoặc RegisterPage).
    return children ? children : <Outlet />;
}

export default PublicRoute;