// src/components/LocationCard.jsx
import React from 'react';
import ImageSwiper from './ImageSwiper';
import '../styles/LocationCard.css';
import LocationIcon from '../assets/default.svg';
import AdIcon from '../assets/adicon.svg'

const LocationCard = ({ location, onClick }) => {
    return (
        // ✨ onClick 핸들러를 추가합니다.
        <div className="location-card" onClick={onClick}>
            <ImageSwiper images={location.picture} />
            <div className="card-details">
                <div className = "card-info">
                    <p className="card-name">{location.name}</p>
                    {location?.advertisement === true && (
                        <div className="ad">
                            <span className="card-ad">광고</span>
                            <img src={AdIcon} alt="광고 아이콘" className="ad-icon" />
                        </div>
                    )}

                </div>
                <div className="card-meta-loc">
                    <img src={LocationIcon} alt="위치 아이콘" className="meta-icon" />
                    <p>{location.address}</p>
                </div>
            </div>
        </div>
    );
};

export default LocationCard;