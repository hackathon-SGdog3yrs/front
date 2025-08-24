import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LeftIcon from "../assets/left.svg?react";

export default function Place() {
  const navigate = useNavigate();
  const { state } = useLocation(); // { from: "create" } 등

  const [q, setQ] = useState("");

  // 대충 더미 장소들
  const presets = useMemo(
    () => [
      "서울 마포구 백범로 35, 우정원 700호",
      "서울 마포구 신수동",
      "서울 마포구 합정동",
      "서울 마포구 서강로",
      "서울 마포구 상암동",
      "서울 마포구 홍대입구역",
      "서울 마포구 공덕동",
      "서울 마포구 성산동",
    ],
    []
  );

  const list = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return presets;
    return presets.filter((s) => s.toLowerCase().includes(k));
  }, [q, presets]);

  const returnToCreate = (locationText) => {
    // create에서 왔다면 상태로 돌려보내기
    if (state?.from === "create") {
      navigate("/create", {
        replace: true,
        state: { location: locationText },
      });
    } else {
      navigate(-1);
    }
  };

  return (
    <main className="create-page">
      {/* 상단 헤더 - 기존 스타일 재사용 */}
      <header className="create-header1">
        <button
          className="back-btn"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
          type="button"
        >
          <LeftIcon className="back-icon" aria-hidden="true" />
        </button>
        <h1>Place.jsx</h1>
      </header>

      <div className="create-form" style={{ gap: 16 }}>
        {/* 검색 입력 */}
        <div className="join-field">
          <div className="join-label">검색</div>
          <input
            type="text"
            placeholder="장소를 입력하세요"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{
              height: 44,
              borderRadius: 10,
              border: "1px solid #F5F5F5",
              padding: "0 12px",
              outline: "none",
            }}
          />
        </div>

        {/* 직접 입력 사용 버튼 */}
        {!!q.trim() && (
          <button
            type="button"
            onClick={() => returnToCreate(q.trim())}
            style={{
              height: 44,
              borderRadius: 10,
              border: "1px solid #E5E5E5",
              background: "#fff",
              textAlign: "left",
              padding: "0 12px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            “{q.trim()}” 사용하기
          </button>
        )}

        {/* 추천 리스트 */}
        <div style={{ display: "grid", gap: 8 }}>
          {list.map((addr, i) => (
            <button
              key={addr + i}
              type="button"
              onClick={() => returnToCreate(addr)}
              style={{
                height: 44,
                borderRadius: 10,
                border: "1px solid #E5E5E5",
                background: "#fff",
                textAlign: "left",
                padding: "0 12px",
                cursor: "pointer",
              }}
            >
              {addr}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
