import React from 'react';

const EmptyCard = ({ imgSrc, message }) => {
    return (
        <div className='flex flex-col items-center justify-center h-screen' style={{ marginTop: '-13vh' }}>
            <img src={imgSrc} alt="No Notes" className='w-96 h-96' />
            <p className='text-lg font-bold text-slate-700 text-center leading-7 mt-2'>
                {message}
            </p>
        </div>
    );
};

export default EmptyCard;
