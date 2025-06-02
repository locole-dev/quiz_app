import {LockOutlined, UserOutlined} from "@ant-design/icons";
import {Button, Checkbox, Form, Input, message} from "antd";
import {useNavigate} from "react-router-dom";
import useAuthStore from "../store/authStore.js";


const SignInPage = () => {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const loading = useAuthStore((state) => state.loading);

    const onFinish = async (values) => {
        try {
            console.log('Login values:', values);
            await login(values);
            message.success('Login successful!');
            navigate('/');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed. Please check your username and password.';
            message.error(errorMessage);
        }
    };

    return (
        <div className="w-full min-h-dvh login-page relative " style={{ paddingTop: 100 }} >
            <div
                className="w-[400px] absolute left-1/2 -translate-x-1/2 bg-white p-10 border-2 border-solid border-gray-100 rounded-lg ">
                <h2 className='font-bold text-center text-3xl mb-10'>Sign In</h2>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{remember: true}}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[{required: true, message: 'Please enter your username!'}]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Username"/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{required: true, message: 'Please enter your password!'}]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon"/>}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item className="flex justify-center items-center">
                        <Button type="primary" htmlType="submit" className="login-form-button mr-1" loading={loading}>
                            Sign In
                        </Button>
                    </Form.Item>
                </Form>
                <div>
                    <div className="text-sm text-center mt-3">
                        Don&apos;t have an account? <a className="font-semibold" href="/register">Register now!</a>
                    </div>
                    <div className="text-center ">
                        <a className="login-form-forgot text-xs text-red-400" href="">
                            Forgot password
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;