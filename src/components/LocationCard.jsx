// src/components/LocationCard.jsx
import React from 'react';
import ImageSwiper from './ImageSwiper';
import '../styles/LocationCard.css';
import LocationIcon from '../assets/default.svg';

const LocationCard = ({ location, onClick }) => {
    return (
        // ✨ onClick 핸들러를 추가합니다.
        <div className="location-card" onClick={onClick}>
            <ImageSwiper images={location.picture} />
            <div className="card-details">
                <p className="card-name">{location.name}</p>
                <div className="card-meta-loc">
                    <img src={LocationIcon} alt="위치 아이콘" className="meta-icon" />
                    <p>{location.address}</p>
                </div>
            </div>
        </div>
    );
};

export default LocationCard;