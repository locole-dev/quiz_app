import {
    Button,
    Checkbox,
    Form,
    Input,
    Select,
    message,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import useAuthStore from "../store/authStore.js";
import AuthService from "../service/authService.js";

const { Option } = Select;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};

const SignUpPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const setLoading = useAuthStore((state) => state.setLoading);
    const loading = useAuthStore((state) => state.loading);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await AuthService.register({
                username: values.username,
                password: values.password,
                email: values.email,
                role: values.role,
            });
            message.success('Registration successful! Please log in.');
            navigate('/login');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-dvh register-page relative">
            <div className="w-[600px] absolute left-1/2 -translate-x-1/2 bg-white p-10 border-2 border-solid border-gray-100 rounded-lg ">
                <h2 className='font-bold text-center text-3xl mb-10'>Register Account</h2>
                <Form
                    {...formItemLayout}
                    form={form}
                    name="register"
                    onFinish={onFinish}
                    scrollToFirstError
                >
                    <Form.Item
                        name="username"
                        label="Username"
                        rules={[
                            { required: true, message: 'Please enter your username!' },
                            { min: 3, max: 50, message: 'Username must be between 3 and 50 characters!' },
                            { whitespace: true, message: 'Username cannot start or end with whitespace!' }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="E-mail"
                        rules={[
                            { type: 'email', message: 'Invalid email!' },
                            { required: true, message: 'Please enter your email!' },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            { required: true, message: 'Please enter your password!' },
                            { min: 6, message: 'Password must be at least 6 characters!' }
                        ]}
                        hasFeedback
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="confirm"
                        label="Confirm Password"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            { required: true, message: 'Please confirm your password!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Passwords do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="role"
                        label="Role"
                        rules={[{ required: true, message: 'Please select a role!' }]}
                        initialValue="USER"
                    >
                        <Select placeholder="Select a role">
                            <Option value="USER">User</Option>
                            <Option value="ADMIN">Admin</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="agreement"
                        valuePropName="checked"
                        rules={[
                            {
                                validator: (_, value) =>
                                    value ? Promise.resolve() : Promise.reject(new Error('You must agree to the terms of use!')),
                            },
                        ]}
                    >
                        <Checkbox>
                            I agree to the terms of use of the application
                        </Checkbox>
                    </Form.Item>

                    <Form.Item wrapperCol={{ xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 8 } }}>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Register
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default SignUpPage;