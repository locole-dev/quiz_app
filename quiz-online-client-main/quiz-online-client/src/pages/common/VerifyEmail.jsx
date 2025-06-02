import {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [message, setMessage] = useState('Please click the button to activate your account.');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [hasToken, setHasToken] = useState(false);
    const [verificationToken, setVerificationToken] = useState(null);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        if (token) {
            setHasToken(true);
            setVerificationToken(token);
            setMessage('Your account is ready to be activated. Click the button below!');
        } else {
            setHasToken(false);
            setMessage('Verification code not found. Invalid link. Please check your email or register again.');
        }
    }, [location.search]);

    const handleActivateAccount = () => {
        if (!verificationToken) {
            setMessage('Error: No verification code to activate.');
            return;
        }

        setIsLoading(true);
        setMessage('Activating your account...');

        axios.get(`http://localhost:9192/api/auth/verify-email?token=${verificationToken}`)
            .then(response => {
                setMessage('Account activated successfully! You can sign in now.');
                setIsSuccess(true);
                setIsLoading(false);
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            })
            .catch(error => {
                setIsSuccess(false);
                setIsLoading(false);
                if (error.response && error.response.data) {
                    setMessage(`Activation error: ${error.response.data}`);
                } else {
                    setMessage('An error occurred during activation. Please try again.');
                }
            });
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: '#f0f2f5',
            fontFamily: 'Arial, sans-serif'
        }}>
            <div style={{
                backgroundColor: '#fff',
                padding: '40px',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                maxWidth: '500px',
                width: '90%'
            }}>
                <h2>Email Verification</h2>
                <p style={{color: isSuccess ? 'green' : (isLoading ? 'gray' : (hasToken && !isSuccess ? 'orange' : 'red'))}}>
                    {message}
                </p>

                {hasToken && !isLoading && !isSuccess && (
                    <button
                        onClick={handleActivateAccount}
                        style={{
                            padding: '12px 25px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            marginTop: '20px',
                            fontSize: '1.1em'
                        }}
                    >
                        Activate Account
                    </button>
                )}

                {isLoading && (
                    <p style={{marginTop: '20px'}}>Processing...</p>
                )}

                {!hasToken && (
                    <button
                        onClick={() => navigate('/register')}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            marginTop: '20px'
                        }}
                    >
                        Register Again
                    </button>
                )}

                {isSuccess && (
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            marginTop: '20px'
                        }}
                    >
                        Go to Sign In
                    </button>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;