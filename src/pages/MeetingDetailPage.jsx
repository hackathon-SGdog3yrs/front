// src/pages/MeetingDetailPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchMeetingDetail,
  fetchHostInfo,
  joinMeeting,
  leaveMeeting,
} from "../api";
import TopBarDetail from "../components/TopBarDetail";
import MeetingHeader from "../components/MeetingHeader";
import MeetingInfo from "../components/MeetingInfo";
import HostInfo from "../components/HostInfo";
import JoinButton from "../components/JoinButton";
import "../styles/MeetingDetailPage.css";

// 로컬 저장 유틸: 내가 참여한 모임 목록
const joinedKey = (uid) => `joined_meetings_user_${uid}`;

function readJoined(uid) {
  try {
    return JSON.parse(localStorage.getItem(joinedKey(uid)) || "[]");
  } catch {
    return [];
  }
}
function writeJoined(uid, arr) {
  localStorage.setItem(joinedKey(uid), JSON.stringify(arr));
}
function addJoined(uid, meet) {
  const arr = readJoined(uid);
  const id = meet?.id ?? meet?.meetId ?? meet?.meetingId;
  if (!id) return;
  if (!arr.some((x) => (x.id ?? x.meetId) === id)) {
    arr.unshift(meet);
    writeJoined(uid, arr);
  }
}
function removeJoined(uid, meetId) {
  const arr = readJoined(uid);
  const next = arr.filter((x) => (x.id ?? x.meetId) !== meetId);
  writeJoined(uid, next);
}

export default function MeetingDetailPage() {
  const { id } = useParams(); // 모임 ID (문자열)
  const meetId = useMemo(() => Number(id), [id]);
  const userId = useMemo(() => Number(localStorage.getItem("uid")) || 1, []);

  const [meetingData, setMeetingData] = useState(null);
  const [hostInfo, setHostInfo] = useState(null);
  const [joined, setJoined] = useState(false);
  const [busy, setBusy] = useState(false);

  // 상세/호스트 가져오기 + 참여상태 초기화
  useEffect(() => {
    (async () => {
      const meet = await fetchMeetingDetail(meetId);
      setMeetingData(meet);

      // hostId가 응답에 있다면 그걸 쓰고, 없으면 meetId로 임시 요청
      const hid = meet?.hostId ?? meet?.userId ?? meetId;
      const host = await fetchHostInfo(hid);
      setHostInfo(host);

      // 서버가 isJoined 같은 플래그를 줄 수도 있으니 우선 반영,
      // 없으면 로컬 joined 목록으로 판단
      const serverJoined =
        meet?.isJoined ?? meet?.joined ?? meet?.data?.isJoined;
      if (typeof serverJoined === "boolean") {
        setJoined(serverJoined);
      } else {
        const inLocal = readJoined(userId).some(
          (x) => (x.id ?? x.meetId) === meetId
        );
        setJoined(inLocal);
      }
    })();
  }, [meetId, userId]);

  // 참여/취소 토글
  const handleJoinClick = async () => {
    if (!meetingData || busy) return;
    setBusy(true);

    try {
      if (!joined) {
        // 참여
        await joinMeeting(userId, meetId);
        setJoined(true);

        // MyPage에 보이도록 로컬에도 즉시 저장
        const slim = {
          id: meetId,
          name: meetingData?.name ?? meetingData?.title ?? "모임",
          title: meetingData?.title ?? meetingData?.name ?? "모임",
          intro: meetingData?.intro ?? "",
          detail: meetingData?.detail ?? "",
          locationName:
            meetingData?.locationName ??
            meetingData?.location ??
            meetingData?.placeName ??
            "",
          datetime:
            meetingData?.datetime ?? meetingData?.dateTime ?? meetingData?.time,
          maximum:
            meetingData?.maximum ??
            meetingData?.maxCount ??
            meetingData?.maxPeople ??
            0,
          current:
            (meetingData?.current ??
              meetingData?.currentCount ??
              meetingData?.nowPeople ??
              0) + 1,
        };
        addJoined(userId, slim);
        alert("모임 참여가 완료되었습니다!");
      } else {
        // 취소
        await leaveMeeting(userId, meetId);
        setJoined(false);
        removeJoined(userId, meetId);
        alert("모임 참여를 취소했습니다.");
      }
    } catch (e) {
      console.error("join/leave error:", e);
      alert("처리 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="screen">
      <div className="phone">
        <TopBarDetail />
        <MeetingHeader data={meetingData} />
        <div className="gray-spacer"></div>
        <MeetingInfo data={meetingData} />
        <div className="gray-spacer"></div>
        <HostInfo data={hostInfo} />
        <JoinButton joined={joined} onClick={handleJoinClick} disabled={busy} />
      </div>
    </div>
  );
}
