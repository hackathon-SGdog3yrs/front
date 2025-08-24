// src/pages/LocationPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LocationTopBar from "../components/LocationTopBar";
import LocationCard from "../components/LocationCard";
import "../styles/LocationPage.css";

export default function LocationPage() {
  const navigate = useNavigate();
  const { state: navState } = useLocation(); // { from: "create", draft: {...} } 형태 기대

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // api 모듈 동적 로드 (named/default 양쪽 대응)
        const mod = await import("../api").catch(() => ({}));
        const fetchLocationList =
          mod.fetchLocationList || mod.default?.fetchLocationList;

        if (!fetchLocationList) {
          throw new Error("fetchLocationList not found in /src/api");
        }

        const res = await fetchLocationList();
        if (!alive) return;
        setLocations(Array.isArray(res) ? res : []);
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || String(e));
        setLocations([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const handleLocationClick = (loc) => {
    // Create에서 왔다면 다시 Create로, 아니면 홈으로
    const backTo = navState?.from === "create" ? "/create" : "/";
    navigate(backTo, {
      replace: true,
      // ✅ 선택 장소와 함께, 넘어올 때 받은 draft(임시 입력값)도 그대로 돌려보냄
      state: {
        selectedLocation: loc,
        draft: navState?.draft,
        from: navState?.from,
      },
    });
  };

  if (loading)
    return <div style={{ padding: 24 }}>장소 목록을 불러오는 중...</div>;
  if (err)
    return <div style={{ padding: 24, color: "crimson" }}>에러: {err}</div>;
  if (locations.length === 0)
    return <div style={{ padding: 24 }}>장소 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="location-page-container">
      <LocationTopBar />
      <div className="location-list">
        {locations.map((location) => (
          <LocationCard
            key={location.id}
            location={location}
            onClick={() => handleLocationClick(location)}
          />
        ))}
      </div>
    </div>
  );
}
