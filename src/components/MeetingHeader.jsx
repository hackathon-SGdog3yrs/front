// src/components/MeetingHeader.jsx
import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faUsers } from '@fortawesome/free-solid-svg-icons';
import CalendarIcon from '../assets/calendar.svg';
import LocationIcon from '../assets/default.svg';
import PersonIcon from '../assets/person.svg';
import '../styles/MeetingHeader.css';
import ImageSwiper from './ImageSwiper';

const MeetingHeader = ({ data }) => {
  // ✨ 추가된 코드: 데이터가 null이면 아무것도 렌더링하지 않습니다.
  if (!data) {
    return null;
  }

  const date = new Date(data.datetime);
  const formattedDateTime = `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()} / ${date.getHours()}:00`;

  return (
    <div className="meeting-header">
      <div className="header-title">
        <h1 className="title-text">{data.name}</h1>
      </div>

      <div className="header-body">
        <p className="body-text">{data.intro}</p>
      </div>

      <div className="header-info">
        <div className="info-item">
          <img src={CalendarIcon} alt="캘린더 아이콘" className="info-icon" />
          <p>{formattedDateTime}</p>
        </div>
        <div className="info-item">
            <div className="person-info-group">
                <img src={PersonIcon} alt="사람 아이콘" className="info-icon" />
                <p>
                    <span className="current-count">{data.current}</span> / {data.maximum}
                </p>
            </div>
        </div>
      </div>
      
      <div className="header-location">
        <img src={LocationIcon} alt="위치 아이콘" className="info-icon" />
        <p>{data.locationName}</p>
      </div>

      {/* 여기에 사진 스와이프 컴포넌트가 들어갈 자리입니다. */}
      <ImageSwiper images={data.locationPicture} />
    </div>
  );
};

export default MeetingHeader;