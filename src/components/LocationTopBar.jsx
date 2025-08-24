// src/components/LocationTopBar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import LeftArrow from '../assets/left.svg';
import CloseIcon from '../assets/close.svg'; // ✨ close.svg 파일 import
import '../styles/LocationTopBar.css';

const LocationTopBar = () => {
    const navigate = useNavigate();

    const handleClose = () => {
        navigate(-1);
    };

    return (
        <div className="top-bar-container">
            <h1 className="location-page-title">모임 장소</h1>
            <button className="close-button" onClick={handleClose}>
                <img src={CloseIcon} alt="닫기" className="close-icon" />
            </button>
        </div>
    );
};

export default LocationTopBar;