import React from 'react';
import '../styles/MeetingInfo.css';

const MeetingInfo = ({ data }) => {
  if (!data || (!data.intro && !data.detail)) {
    return null;
  }

  return (
    <div className="meeting-info-container">
      <div className="info-section">
        <h2 className="section-title">모임 정보</h2>
        <p className="section-content">{data.detail}</p>
      </div>

    </div>
  );
};

export default MeetingInfo;