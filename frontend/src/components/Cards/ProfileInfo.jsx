import React from 'react';
import { getInitials } from '../../utils/helper';

const ProfileInfo = ({ userInfo, onLogout }) => {
    if (!userInfo) {
        return null; // or return a loading indicator or default content
    }

    return (
        <div className='flex items-center gap-3 ml-4'>
        <div className='w-12 h-12 flex items-center justify-center rounded-full bg-gray-200'>
            <span className="text-black font-medium">{getInitials(userInfo.fullName)}</span>
        </div>
        <div>
            <p className='text-sm font-medium text-black'>{userInfo.fullName}</p>
            <button className='text-sm text-black underline' onClick={onLogout}>Logout</button>
        </div>
    </div>
    );
}

export default ProfileInfo;
