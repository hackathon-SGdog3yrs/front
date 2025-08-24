import React, { useState } from 'react';
import MyPageMeetingCard from './MyPageMeetingCard';
import { fetchMeetingDetail } from '../api';
import '../styles/MyPageMeetings.css';
import RightArrow from '../assets/right.svg';

const MyPageMeetings = ({ userInfo }) => {
  const [showJoined, setShowJoined] = useState(false);
  const [showCreated, setShowCreated] = useState(false);
  const [joinedMeetings, setJoinedMeetings] = useState([]);
  const [createdMeetings, setCreatedMeetings] = useState([]);

  const fetchMeetingDetails = async (meetIds, setter) => {
    const meetingDetails = await Promise.all(
      meetIds.map(async (id) => {
        const detail = await fetchMeetingDetail(id);
        return detail;
      })
    );
    setter(meetingDetails.filter(m => m !== null));
  };

  const joinedCount = userInfo.joinedMeetID ? userInfo.joinedMeetID.length : 0;
  const createdCount = userInfo.createdMeetID ? userInfo.createdMeetID.length : 0;

  const toggleJoined = () => {
    if (!showJoined && joinedCount > 0 && joinedMeetings.length === 0) {
      fetchMeetingDetails(userInfo.joinedMeetID, setJoinedMeetings);
    }
    setShowJoined(!showJoined);
  };

  const toggleCreated = () => {
    if (!showCreated && createdCount > 0 && createdMeetings.length === 0) {
      fetchMeetingDetails(userInfo.createdMeetID, setCreatedMeetings);
    }
    setShowCreated(!showCreated);
  };

  return (
    <div className="my-page-meetings-container">
      {/* 참여한 모임 */}
      <div className="meeting-list-section">
        <div className="list-header" onClick={toggleJoined}>
          <p>참여한 모임 <span className="highlight-number">{joinedCount}</span></p>
          {/* ✨ 참여한 모임 아이콘의 className을 showJoined 상태에 연결 */}
          <img src={RightArrow} alt="토글 아이콘" className={`toggle-icon ${showJoined ? 'expanded' : ''}`} />
        </div>
        {showJoined && (
          <div className="meeting-cards">
            {joinedMeetings.map((meeting, index) => (
              <MyPageMeetingCard key={meeting.id} meeting={meeting} />
            ))}
          </div>
        )}
      </div>

      {/* 생성한 모임 */}
      <div className="meeting-list-section">
        <div className="list-header" onClick={toggleCreated}>
          <p>생성한 모임 <span className="highlight-number">{createdCount}</span></p>
          {/* ✨ 생성한 모임 아이콘의 className은 showCreated 상태에 연결 */}
          <img src={RightArrow} alt="토글 아이콘" className={`toggle-icon ${showCreated ? 'expanded' : ''}`} />
        </div>
        {showCreated && (
          <div className="meeting-cards">
            {createdMeetings.map((meeting, index) => (
              <MyPageMeetingCard key={meeting.id} meeting={meeting} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPageMeetings;