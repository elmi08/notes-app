import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/Input/PasswordInput';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosinstance';
import logoImage from '../../assets/images/logo.png';
import loginImage from '../../assets/images/login.jpg';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        // Clear previous errors
        setError('');

        // Validate email and password
        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        if (!password) {
            setError('Please enter a password');
            return;
        }

        try {
            const response = await axiosInstance.post('/login', {
                email: email,
                password: password,
            });

            if (response.data && response.data.accessToken) {
                localStorage.setItem('token', response.data.accessToken);
                navigate('/dashboard');
            } else {
                setError('Login failed. Please try again.');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('An unexpected error occurred. Please try again later');
            }
        }
    };

    return (
        <>
            <div className='flex items-center justify-center min-h-screen bg-gray-100'>
                <div className='flex w-4/5 max-w-6xl'>
                    <div className='hidden md:block md:w-1/2'>
                        <img className='object-cover w-full h-full' src={loginImage} alt='Background Image' />
                    </div>
                    <div className='w-full md:w-1/2 flex flex-col justify-center bg-white p-8'>
                        <div className='sm:mx-auto sm:w-full sm:max-w-sm mb-6'>
                            <img className='mx-auto w-16 h-16 mb-4' src={logoImage} alt='Logo' />
                            <h2 className='text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
                                Sign in to your account
                            </h2>
                        </div>
                        <form onSubmit={handleLogin} className='mb-4'>
                            <input
                                type='text'
                                placeholder='Email'
                                className='w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded mb-4 outline-none'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <PasswordInput onChange={(e) => setPassword(e.target.value)} />
                            {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}
                            <button
                                type='submit'
                                className='flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-m font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                            >
                                Login
                            </button>
                            <p className='text-sn text-center mt-4'>
                                Not registered yet?{' '}
                                <Link to='/signUp' className='font medium text-primary underline'>
                                    Create an Account
                                </Link>
                            </p>
                        </form>
                        <div className='text-center'>
                            <Link
                                to='/'
                                className='text-blue-600 text-sm hover:underline mt-2 cursor-pointer'
                            >
                                Back to Landing Page
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
