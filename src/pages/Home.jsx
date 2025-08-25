// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import Location from "../components/Location";
import Navbar from "../components/Navbar";
import MeetingShort from "../components/MeetingShort";
import TopBar from "../components/TopBar";
import Button from "../components/Button";

import "../styles/Home.css";

/** A안 권장: 항상 /api 사용 */
const ENDPOINT = "/api/meet/list";

/** 상대경로 → 절대경로 보정 */
const ASSET_BASE = (
  import.meta.env.VITE_ASSET_BASE ||
  import.meta.env.VITE_API_URL ||
  ""
).replace(/\/$/, "");
function toURL(src) {
  if (!src) return "";
  if (Array.isArray(src)) src = src[0];
  const s = String(src);
  if (/^https?:\/\//i.test(s)) return s; // 이미 절대 URL
  if (!ASSET_BASE) return s.replace(/^\//, "/"); // 베이스가 없으면 그대로
  return `${ASSET_BASE}/${s.replace(/^\//, "")}`;
}

/** KST 포맷 */
function formatDateKST(when) {
  const d = new Date(when);
  if (Number.isNaN(d.getTime())) return String(when ?? "");
  const parts = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .formatToParts(d)
    .reduce((acc, p) => ((acc[p.type] = p.value), acc), {});
  return `${parts.year}.${parts.month}.${parts.day} / ${parts.hour}:${parts.minute}`;
}

/** 서버 응답 → 카드 props 매핑 */
function mapServerToCard(m) {
  const id = m.id ?? m.meetId ?? m.meetingId ?? null;
  const name = m.name ?? m.title ?? "모임";
  const intro = m.intro ?? m.detail ?? "";
  const locationName = m.locationName ?? m.placeName ?? m.location ?? "";
  const when = m.datetime ?? m.dateTime ?? m.time ?? "";
  const current = m.current ?? m.currentCount ?? m.nowPeople ?? 0;
  const maximum = m.maximum ?? m.maxCount ?? m.maxPeople ?? 0;

  // ✅ 사진: locationPicture(배열/문자), picture 등 가능한 필드 수용
  const rawPic =
    m.locationPicture ?? m.locationPictures ?? m.picture ?? m.thumbnail ?? null;

  return {
    id,
    title: name,
    body: intro,
    location: locationName,
    time: when ? formatDateKST(when) : "",
    currentCount: current,
    maxCount: maximum,
    highlightColor: "#B40039",
    picture: toURL(rawPic), // ✅ MeetingShort로 내려갈 최종 썸네일 URL
    _raw: m,
  };
}

export default function Home() {
  const navigate = useNavigate();
  const [serverData, setServerData] = useState(null); // null=미수신, []=빈 데이터
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ctrl = new AbortController();
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(ENDPOINT, { signal: ctrl.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const arr = Array.isArray(json)
          ? json
          : json?.meetings ||
            json?.data ||
            json?.result ||
            json?.content ||
            json?.items ||
            [];
        if (mounted) setServerData(Array.isArray(arr) ? arr : []);
      } catch (e) {
        if (e?.name === "AbortError") return;
        console.warn("meet list fetch failed:", e);
        if (mounted) setServerData([]); // 실패 시에도 더미 대신 빈 배열
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      ctrl.abort();
    };
  }, []);

  // 서버 데이터만 사용
  const list = (serverData || []).map(mapServerToCard).map((m, idx) => ({
    ...m,
    id: m.id ?? idx,
  }));

  return (
    <div className="screen">
      <div className="phone">
        {/* 상단바 */}
        <TopBar sticky onSearchClick={() => navigate("/search")} />

        {/* 메인 타이틀 */}
        <h2 className="home-title">오늘은 어떤 모임에<br />참여해볼까요?</h2>

        {/* 위치/지역 변경 */}
        <div className="row">
          <Location />
        </div>

        {/* 액션 버튼 */}
        <div className="actions">
          <Button variant="primary" fullWidth onClick={() => navigate("/ai")}>
            AI 추천
          </Button>
          <Button variant="ghost" fullWidth onClick={() => navigate("/create")}>
            모임 생성
          </Button>
        </div>

        {/* 로딩 */}
        {loading && (
          <p style={{ padding: "8px 24px", color: "#777" }}>불러오는 중…</p>
        )}

        {/* 리스트 */}
        {!loading && (
          <div className="list">
            {list.length > 0 ? (
              list.map((meeting) => (
                <Link
                  key={meeting.id}
                  to={`/meeting/${meeting.id}`}
                  state={{ meeting }}
                  className="meeting-card"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "block",
                  }}
                >
                  {/* ✅ picture가 포함되어 내려감 */}
                  <MeetingShort {...meeting} />
                </Link>
              ))
            ) : (
              <p style={{ padding: "8px 24px", color: "#777" }}>
                표시할 모임이 없어요.
              </p>
            )}
          </div>
        )}

        {/* 하단 네비게이션 */}
        <Navbar />
      </div>
    </div>
  );
}
