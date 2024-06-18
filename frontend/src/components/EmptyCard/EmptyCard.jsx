import React from 'react';
import logoImage from '../../assets/images/logo.png'; 

const EmptyCard = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-white bg-gradient-to-r from-blue-500 to-indigo-600">
      <main className="flex flex-col items-center justify-center flex-1 text-center p-6 mt-[-80px]">
        <img src={logoImage} alt="Logo" className="h-20 mb-8" />
        <h1 className="text-5xl font-bold mb-4">Click on the + Icon the Bottom Right Corner to Add a Note</h1>
        <p className="text-xl mb-8">
          Your personal space to take notes, stay organized, and be productive.
        </p>
      </main>
    </div>
  );
};

export default EmptyCard;
