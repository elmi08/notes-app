import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../../assets/images/logo.png'; 

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
      <header className="flex justify-between items-center w-full p-6">
        <div className="flex items-center">
          <img src={logoImage} alt="Logo" className="h-12" />
          <h2 className="text-2xl font-bold ml-2">Fast Note</h2>
        </div>
        <div>
          <Link
            to="/login"
            className="mr-4 text-lg hover:underline"
          >
            Login
          </Link>
          <Link
            to="/signUp"
            className="text-lg bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-gray-200"
          >
            Sign Up
          </Link>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center flex-1 text-center p-6 mt-[-80px]">
        <img src={logoImage} alt="Logo" className="h-20 mb-8" />
        <h1 className="text-5xl font-bold mb-4">Welcome to Fast Note</h1>
        <p className="text-xl mb-8">
          Your personal space to take notes, stay organized, and be productive.
        </p>
        <div>
          <Link
            to="/signUp"
            className="text-lg bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-gray-200"
          >
            Get Started
          </Link>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
