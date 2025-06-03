import React, {useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes, useLocation} from 'react-router-dom';
import {ConfigProvider, Layout, message as AntdMessage, Spin} from 'antd'; // Added ConfigProvider, message
import useAuthStore from './store/authStore'; // Import Zustand store
// --- Import your routing components ---
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PublicRoute from './components/PublicRoute.jsx'; // Make sure you have this file
// --- Import your pages ---
import QuizList from './pages/quizzes/QuizList';
import QuizDetail from './pages/quizzes/QuizDetail';
import QuizForm from './pages/quizzes/QuizForm';
import QuestionList from './pages/questions/QuestionList';
import QuestionForm from './pages/questions/QuestionForm';
import TakeQuiz from './pages/attempts/TakeQuiz';
import UserAttempts from './pages/attempts/UserAttempts';
import QuizResults from './pages/results/QuizResults';
import NotFound from './pages/common/NotFound';
import SignInPage from "./pages/SignInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import ResultDetail from "./pages/results/ResultsDetail.jsx";
import VerifyEmail from "./pages/common/VerifyEmail.jsx";

// --- Import Layout Components ---
import Navbar from "./components/layout/NavBar.jsx";
import {Footer} from "antd/es/layout/layout.js";

const {Content} = Layout;

// This component will contain all the main routes, handling the layout
const AppRoutes = () => {
    const location = useLocation();
    const initializeAuth = useAuthStore((state) => state.initializeAuth);
    const loading = useAuthStore((state) => state.loading); // Use loading from store for global spin

    // Initialize auth state from localStorage when the app loads
    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    // Determine if Navbar and Footer should be hidden
    // We want to hide them on login, register, and verify-email pages
    const hideLayout = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/verify-email';

    // If the global auth loading is true, show a full-screen spinner
    // This handles initial loading and potential refresh token checks
    if (loading) {
        return (
            <Layout style={{minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Spin size="large" tip="Đang kiểm tra phiên đăng nhập..."/>
            </Layout>
        );
    }

    // Otherwise, render the main layout with routes
    return (
        <Layout style={{minHeight: '100vh'}}>
            {/* Conditionally render Navbar */}
            {!hideLayout && <Navbar/>}

            <Content
                style={{padding: '0px', flex: 1}}> {/* Remove fixed padding here if you want pages to control it */}
                <div style={{background: '#fff', minHeight: '100%'}}> {/* Ensure content div takes full height */}
                    <Routes>
                        {/* --- Public Routes (Accessible only if NOT authenticated) --- */}
                        {/* If authenticated, PublicRoute will redirect to '/' (or /dashboard) */}
                        <Route element={<PublicRoute/>}>
                            <Route path="/login" element={<SignInPage/>}/>
                            <Route path="/register" element={<SignUpPage/>}/>
                            <Route path="/verify-email" element={<VerifyEmail/>}/>
                        </Route>

                        {/* --- Protected Routes (Accessible only if AUTHENTICATED) --- */}
                        {/* If not authenticated, ProtectedRoute will redirect to '/login' */}
                        <Route element={<ProtectedRoute/>}>
                            <Route path="/"
                                   element={<QuizList/>}/> {/* Assuming QuizList is the default protected page */}
                            <Route path="/quizzes" element={<QuizList/>}/>
                            <Route path="/quizzes/new" element={<QuizForm/>}/>
                            <Route path="/quizzes/:id" element={<QuizDetail/>}/>
                            <Route path="/quizzes/:id/edit" element={<QuizForm/>}/>

                            <Route path="/quizzes/:quizId/questions" element={<QuestionList/>}/>
                            <Route path="/quizzes/:quizId/questions/new" element={<QuestionForm/>}/>
                            <Route path="/quizzes/:quizId/questions/:id/edit" element={<QuestionForm/>}/>

                            <Route path="/take-quiz/:quizId" element={<TakeQuiz/>}/>
                            <Route path="/my-attempts/:userId" element={<UserAttempts/>}/>

                            <Route path="/results/:attemptId" element={<ResultDetail/>}/>
                            <Route path="/results/quiz/:quizId" element={<QuizResults/>}/>
                        </Route>

                        {/* --- Catch-all for Not Found pages --- */}
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </div>
            </Content>

            {/* Conditionally render Footer */}
            {!hideLayout &&
                <Footer style={{textAlign: 'center'}}>Quiz App ©{new Date().getFullYear()} Created by You</Footer>}
        </Layout>
    );
};

function App() {
    const [messageApi, contextHolder] = AntdMessage.useMessage(); // For Ant Design global messages

    return (
        <ConfigProvider> {/* Use ConfigProvider for global Ant Design settings */}
            {contextHolder} {/* Place contextHolder for Ant Design messages */}
            <Router>
                <AppRoutes/> {/* All routing logic is now inside AppRoutes */}
            </Router>
        </ConfigProvider>
    );
}

export default App;