// src/components/MyPageHeader.jsx
import React from 'react';
import '../styles/MyPageHeader.css';
import PersonProfileIcon from '../assets/person_profile.svg'; // ✨ SVG 파일 import

const MyPageHeader = ({ userInfo }) => {
  if (!userInfo) {
    return null;
  }
  
  const genderInKorean = userInfo.gender === 'F' ? '여성' : (userInfo.gender === 'M' ? '남성' : '');
  
  return (
    <div className="my-page-header">
      <div className="profile-info-group">
        <div className="profile-icon-container">
          <img src={PersonProfileIcon} alt="프로필 아이콘" className="profile-icon" /> {/* ✨ img 태그로 변경 */}
        </div>
        <div className="profile-text-group">
            <p className="user-name">{userInfo.name}</p>
            <p className="user-meta">{userInfo.age}세, {genderInKorean}</p>
        </div>
      </div>
    </div>
  );
};

export default MyPageHeader;