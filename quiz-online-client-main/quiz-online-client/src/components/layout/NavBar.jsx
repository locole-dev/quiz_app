import { Link, useNavigate } from 'react-router-dom';
    import { Avatar, Button, Dropdown, Layout, Menu, Space, Divider } from 'antd';
    import {
        HomeOutlined,
        LoginOutlined,
        LogoutOutlined,
        PlusOutlined,
        SolutionOutlined,
        UserOutlined
    } from '@ant-design/icons';
    import useAuthStore from "../../store/authStore.js";

    const { Header } = Layout;

    function Navbar() {
        const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
        const currentUser = useAuthStore((state) => state.currentUser);
        const logout = useAuthStore((state) => state.logout);
        const navigate = useNavigate();

        const handleLogout = () => {
            logout();
            navigate('/login');
        };

        const currentUserId = currentUser?.userId;

        const menuItems = [
         { key: 'home', icon: <HomeOutlined />, label: <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link> },
        ];

        if (isAuthenticated) {
            menuItems.push({
                key: 'my-attempts',
                icon: <SolutionOutlined />,
                label: <Link to={`/my-attempts/${currentUserId || ''}`}  style={{ textDecoration: 'none', color: 'inherit' }}>My Attempts</Link>
            });
        }

        const dropdownMenuItems = [
            { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', onClick: handleLogout },
        ];

        return (
            <Header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 32px',
                    background: 'linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)',
                    boxShadow: '0 2px 8px rgba(30, 60, 114, 0.08)',
                    borderRadius: '0 0 12px 12px',
                    minHeight: 64,
                }}
            >
                <div style={{
                    color: '#fff',
                    fontSize: 28,
                    fontWeight: 700,
                    letterSpacing: 1,
                    marginRight: 32,
                }}>
                    <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Quiz App</Link>
                </div>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    items={menuItems}
                    style={{
                        flex: 1,
                        minWidth: 0,
                        background: 'transparent',
                        borderBottom: 'none',
                        fontSize: 16,
                    }}
                />
                <Space size={16}>
                    {isAuthenticated ? (
                        <Dropdown menu={{ items: dropdownMenuItems }} placement="bottomRight" arrow>
                            <Button
                                type="text"
                                style={{
                                    color: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontWeight: 500,
                                    background: 'rgba(255,255,255,0.08)',
                                    borderRadius: 8,
                                    padding: '0 12px',
                                    height: 40,
                                }}
                            >
                                <Space size={8}>
                                    <Avatar
                                        icon={<UserOutlined />}
                                        style={{
                                            background: '#ffd700',
                                            color: '#1e3c72',
                                            fontWeight: 700,
                                        }}
                                    />
                                    <span>{currentUser?.userName || 'User'}</span>
                                </Space>
                            </Button>
                        </Dropdown>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button
                                    type="primary"
                                    icon={<LoginOutlined />}
                                    style={{
                                        background: '#ffd700',
                                        color: '#1e3c72',
                                        fontWeight: 600,
                                        borderRadius: 8,
                                    }}
                                >
                                    Sign In
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button
                                    icon={<PlusOutlined />}
                                    style={{
                                        borderRadius: 8,
                                        fontWeight: 500,
                                        color: '#fff',
                                        border: '1px solid #ffd700',
                                        background: 'transparent',
                                    }}
                                >
                                    Sign Up
                                </Button>
                            </Link>
                        </>
                    )}
                </Space>
            </Header>
        );
    }

    export default Navbar;