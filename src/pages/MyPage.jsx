// src/pages/MyPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { fetchHostInfo, fetchUserJoinedList } from "../api";
import MyPageTopBar from "../components/MyPageTopBar";
import MyPageHeader from "../components/MyPageHeader";
import MyPageMeetings from "../components/MyPageMeetings";
import "../styles/MyPage.css";

/* ---------- 로컬 저장 읽기 ---------- */
function getLocalCreated(userId) {
  try {
    const key = `created_meetings_user_${userId}`;
    const arr = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function getLocalJoined(userId) {
  try {
    const key = `joined_meetings_user_${userId}`;
    const arr = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

/* ---------- 유틸 ---------- */
const getId = (m) => m?.id ?? m?.meetId ?? m?.meetingId ?? JSON.stringify(m);

function dedupById(arr) {
  const seen = new Set();
  const out = [];
  for (const it of arr) {
    const id = getId(it);
    if (!seen.has(id)) {
      seen.add(id);
      out.push(it);
    }
  }
  return out;
}

/* 서버 user 정보 안에 있을 수도 있는 필드들에서 '내가 만든'만 추출 */
function extractCreatedFromUserInfo(ui, userId) {
  if (!ui) return [];
  const candidates =
    [
      ui.createdMeetings,
      ui.myCreatedMeetings,
      ui.hostedMeetings,
      ui.meetingsCreated,
      ui.ownMeetings,
      ui.myMeetings?.created,
      ui.meetings,
    ]
      .filter(Boolean)
      .flat?.() ?? [];

  return Array.isArray(candidates) && candidates.length
    ? candidates.filter((m) =>
        m?.hostId ? Number(m.hostId) === Number(userId) : true
      )
    : [];
}

/* 서버 user 정보 안에 있을 수도 있는 필드들에서 '내가 참여한' 추출 */
function extractJoinedFromUserInfo(ui) {
  if (!ui) return [];
  const candidates =
    [
      ui.joinedMeetings,
      ui.myJoinedMeetings,
      ui.participatingMeetings,
      ui.meetingsJoined,
      ui.myMeetings?.joined,
      ui.attends,
    ]
      .filter(Boolean)
      .flat?.() ?? [];
  return Array.isArray(candidates) ? candidates : [];
}

const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [joinedServer, setJoinedServer] = useState([]); // 서버에서 받은 '참여한 모임'
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // 로그인/사용자 아이디 (임시 1)
  const userId = 1;

  /* 서버에서 유저 정보 + 참여 목록 가져오기 */
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [ui, joined] = await Promise.all([
          fetchHostInfo(userId),
          fetchUserJoinedList(userId),
        ]);
        if (!alive) return;
        setUserInfo(ui || null);
        setJoinedServer(Array.isArray(joined) ? joined : []);
      } catch (error) {
        console.error("Failed to fetch user data or joined list:", error);
        if (!alive) return;
        setUserInfo(null);
        setJoinedServer([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [userId, location.key]); // 페이지로 되돌아왔을 때도 새로 계산되도록

  // 로컬 저장된 생성/참여 모임
  const localCreated = useMemo(() => getLocalCreated(userId), [userId]);
  const localJoined = useMemo(() => getLocalJoined(userId), [userId]);

  // 백엔드 + 로컬 병합
  const effectiveUserInfo = useMemo(() => {
    const base = userInfo || { id: userId, name: "나", nickname: "나" };

    // 만든 모임
    const serverCreated = extractCreatedFromUserInfo(base, userId);
    const mergedCreated = dedupById([
      ...(serverCreated || []),
      ...localCreated,
    ]);

    // 참여한 모임 (서버 응답 우선, 없으면 userInfo 내 추정 필드에서)
    const serverJoinedFromInfo = extractJoinedFromUserInfo(base);
    const serverJoined =
      (joinedServer?.length ? joinedServer : serverJoinedFromInfo) || [];
    const mergedJoined = dedupById([...(serverJoined || []), ...localJoined]);

    // 여러 키에 같은 값 주입(컴포넌트가 어떤 키를 보더라도 보이게)
    return {
      ...base,
      createdMeetings: mergedCreated,
      myCreatedMeetings: mergedCreated,
      hostedMeetings: mergedCreated,
      meetingsCreated: mergedCreated,
      ownMeetings: mergedCreated,

      joinedMeetings: mergedJoined,
      myJoinedMeetings: mergedJoined,
      participatingMeetings: mergedJoined,
      meetingsJoined: mergedJoined,
    };
  }, [userInfo, joinedServer, localCreated, localJoined, userId]);

  if (loading && !effectiveUserInfo) {
    return (
      <div className="my-page-container">
        <MyPageTopBar />
        <div className="gray-spacer"></div>
      </div>
    );
  }

  if (!effectiveUserInfo) {
    return (
      <div className="my-page-container">
        <MyPageTopBar />
        <div className="gray-spacer"></div>
      </div>
    );
  }

  return (
    <div className="my-page-container">
      <MyPageTopBar />
      <div className="gray-spacer"></div>
      <MyPageHeader userInfo={effectiveUserInfo} />
      <div className="gray-spacer"></div>
      {/* 이 컴포넌트 내부에서 created/joined 둘 다 표시되도록 설계되어 있다면 그대로 전달 */}
      <MyPageMeetings userInfo={effectiveUserInfo} />
    </div>
  );
};

export default MyPage;
