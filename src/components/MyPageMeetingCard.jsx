import React from 'react';
import CalendarIcon from '../assets/calendar.svg';
import LocationIcon from '../assets/default.svg';
import PersonIcon from '../assets/person.svg';
import ImageSwiper from './ImageSwiper';
import '../styles/MyPageMeetingCard.css';

const MyPageMeetingCard = ({ meeting }) => {
  if (!meeting) {
    return null;
  }

  const date = new Date(meeting.datetime);
  const formattedDateTime = `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()} / ${date.getHours()}:00`;

  return (
    <div className="mypage-meeting-item">
      <div className="meeting-title">
        <h1 className="item-title-text">{meeting.name}</h1>
      </div>
      <div className="meeting-body">
        <p className="item-body-text">{meeting.intro}</p>
      </div>
      <ImageSwiper images={meeting.locationPicture} />
      <div className="meeting-info">
        <div className="info-item">
          <img src={CalendarIcon} alt="캘린더 아이콘" className="info-icon" />
          <p>{formattedDateTime}</p>
        </div>
        <div className="info-item">
          <img src={PersonIcon} alt="사람 아이콘" className="info-icon" />
          <p>
            <span className="current-count">{meeting.current}</span> / {meeting.maximum}
          </p>
        </div>
      </div>
      <div className="meeting-location">
        <img src={LocationIcon} alt="위치 아이콘" className="info-icon" />
        <p>{meeting.locationName}</p>
      </div>
    </div>
  );
};

export default MyPageMeetingCard;