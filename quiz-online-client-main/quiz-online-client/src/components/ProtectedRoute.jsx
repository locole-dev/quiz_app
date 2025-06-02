import { Navigate, Outlet } from 'react-router-dom';
import { Spin } from 'antd';
import useAuthStore from '../store/authStore'; // Import Zustand store

function ProtectedRoute({ children }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const loading = useAuthStore((state) => state.loading);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" tip="Đang kiểm tra phiên đăng nhập..." />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children ? children : <Outlet />;
}

export default ProtectedRoute;