import React, { useState } from 'react';
import ProfileInfo from "../../components/Cards/ProfileInfo";
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../components/SearchBar/SearchBar';
import logoImage from '../../assets/images/logo.png'

const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => {
    const [searchQuery, setSearchQuery] = useState("");

    const navigate = useNavigate();

    const onLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const handleSearch = () => {
        if (searchQuery) {
            onSearchNote(searchQuery);
        }
    };

    const onClearSearch = () => {
        setSearchQuery("");
        handleClearSearch();
    };

    return (
        <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
        <div className="flex items-center">
            <img src={logoImage} alt="Logo" className="h-8 mr-2" />
            <h2 className="text-xl font-bold text-black">Fast Notes</h2>
        </div>
        <div className="flex-grow ml-20 mr-16">
            <SearchBar
                value={searchQuery}
                onChange={({ target }) => setSearchQuery(target.value)}
                handleSearch={handleSearch}
                onClearSearch={onClearSearch}
            />
        </div>
        <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
    </div>

    
    );
};

export default Navbar;
