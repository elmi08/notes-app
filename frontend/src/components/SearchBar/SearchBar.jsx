import React from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { IoMdClose } from "react-icons/io";

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
    return (
        <div className='flex items-center px-3 bg-slate-100 rounded-md'>
        <input
            type='text'
            placeholder='Search Notes'
            className='w-full text-sm bg-transparent py-2 outline-none'
            value={value}
            onChange={onChange}
        />
        {value && (
            <IoMdClose
                className='text-slate-400 cursor-pointer hover:text-black ml-2'
                onClick={onClearSearch}
                size={20}
            />
        )}
        <FaMagnifyingGlass
            className='text-slate-400 cursor-pointer hover:text-black ml-2'
            onClick={handleSearch}
            size={20}
        />
    </div>
    );
};

export default SearchBar;
