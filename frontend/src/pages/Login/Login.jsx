import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { Link, useNavigate } from "react-router-dom"
import PasswordInput from '../../components/Input/PasswordInput'
import { validateEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosinstance'


const Login = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)

    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault();

        // Clear previous errors
        setError("");

        // Validate email and password
        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        if (!password) {
            setError("Please enter a password");
            return;
        }

        try {
            const response = await axiosInstance.post("/login", {
                email: email,
                password: password
            });

            if (response.data && response.data.accessToken) {
                localStorage.setItem("token", response.data.accessToken);
                navigate("/dashboard");
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
            <Navbar />
            <div className='flex items-center justify-center mt-28'>
                <div className='w-96 border rounded bg-white px-7 py-10'>
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm mb-6">
                        <img
                            className="mx-auto h-10 w-auto"
                            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                            alt="Your Company"
                        />
                        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
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

                        <PasswordInput
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}
                        <button type='submit'
                            className='flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-m font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                        >Login</button>
                        <p className='text-sn text-center mt-4'>
                            Not registered yet? {""}
                            <Link
                                to='/signUp'
                                className="font medium text-primary underline"
                            >
                                Create an Account
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login