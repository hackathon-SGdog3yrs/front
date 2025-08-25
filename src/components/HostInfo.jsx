import React from 'react';
import '../styles/HostInfo.css';

const HostInfo = ({ data }) => {
    if (!data) {
        return null;
    }
    
    const genderInKorean = data.gender === 'F' ? '여성' : (data.gender === 'M' ? '남성' : '');
    const joinedCount = data.joinedMeetID ? data.joinedMeetID.length : 0;
    const createdCount = data.createdMeetID ? data.createdMeetID.length : 0;

    return (
        <div className="host-info-container">
            <h2 className="section-title">등록자 정보</h2>
            <div className="host-details">
                <p className="host-name">{data.name}</p>
            </div>
            <div className="host-meta">
                <p>{data.age}세, {genderInKorean}</p>
            </div>
            <div className="host-stats">
                <p className="stat-item">
                    <span className="stat-label">모임 참여</span> 
                    <span className="stat-number">{joinedCount}회</span>
                </p>
                <p className="stat-item">
                    <span className="stat-label">모임 생성</span> 
                    <span className="stat-number">{createdCount}회</span>
                </p>
            </div>
        </div>
    );
};

export default HostInfo;