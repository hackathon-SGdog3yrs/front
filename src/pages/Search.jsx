// src/pages/Search.jsx
import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import MeetingShort from "../components/MeetingShort";
import Searchbar from "../components/Searchbar";
import DropDown from "../components/DropDown";
import leftIcon from "../assets/left.svg";
import "../styles/Search.css";
import "../styles/DropDown.css";

const SEARCH_ENDPOINT = "/api/meet/search";

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
  if (/^https?:\/\//i.test(s)) return s;
  if (!ASSET_BASE) return s.replace(/^\//, "/");
  return `${ASSET_BASE}/${s.replace(/^\//, "")}`;
}

/** KST(서울) 기준 "YYYY.MM.DD / HH:mm" 포맷 */
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

/** 서버 응답 → 카드 매핑 (MeetingShort에 맞춤) */
function mapApiToMeeting(item) {
  const id = item.id ?? item.meetId ?? item.meetingId ?? null;
  const when =
    item.datetime ?? item.dateTime ?? item.time ?? item.meetTime ?? "";

  const rawPic =
    item.locationPicture ??
    item.locationPictures ??
    item.picture ??
    item.thumbnail ??
    null;

  return {
    id,
    title: item.name,
    body: item.intro ?? item.detail ?? "",
    location: item.locationName ?? item.location ?? item.placeName ?? "",
    time: when ? formatDateKST(when) : "",
    currentCount: item.current ?? item.currentCount ?? item.nowPeople ?? 0,
    maxCount: item.maximum ?? item.maxCount ?? item.maxPeople ?? 0,
    highlightColor: "#B40039",
    picture: toURL(rawPic), // ✅ 썸네일 전달
    _raw: item,
  };
}

/** 검색 모드와 필드 매핑 */
const MODE_OPTIONS = [
  { label: "전체", value: "all" },
  { label: "모임명", value: "name" },
  { label: "설명", value: "desc" },
  { label: "태그", value: "tag" },
];

const MODE_FIELDS = {
  all: [
    "name",
    "detail",
    "intro",
    "locationName",
    "location",
    "placeName",
    "tag",
  ],
  name: ["name"],
  desc: ["detail", "intro"],
  tag: ["tag"],
};

const PLACEHOLDER_BY_MODE = {
  all: "관심사를 입력하세요…",
  name: "모임명을 입력하세요…",
  desc: "설명 키워드를 입력하세요…",
  tag: "#태그를 입력하세요…",
};

function SkeletonCard() {
  return (
    <div className="skel-card">
      <div className="skel-thumb" />
      <div className="skel-right">
        <div className="skel-line w2" />
        <div className="skel-line w1" />
        <div className="skel-chip w120" />
        <div className="skel-line w3" />
        <div className="skel-chip w95" />
      </div>
    </div>
  );
}

/** 방탄 검색(파라미터 여러 방식 시도) */
async function queryApi(
  { keyword, userId, fields, sort = "currentDesc" },
  signal
) {
  const tryFetch = async (paramsObj, label) => {
    const usp = new URLSearchParams(paramsObj);
    const url = `${SEARCH_ENDPOINT}?${usp.toString()}`;
    if (import.meta.env.DEV) console.log("[SEARCH try]", label, url);
    const res = await fetch(url, { method: "GET", signal }).catch(() => null);
    if (!res) return { ok: false, status: 0, text: "no response" };
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      if (import.meta.env.DEV)
        console.warn("[SEARCH fail]", label, res.status, text);
      return { ok: false, status: res.status, text };
    }
    const data = await res.json().catch(() => null);
    const items = Array.isArray(data)
      ? data
      : data?.data ?? data?.result ?? data?.items ?? [];
    return {
      ok: Array.isArray(items),
      items: Array.isArray(items) ? items : [],
    };
  };

  const BASE = { id_u: String(userId) };
  const attempts = [];

  attempts.push([
    { ...BASE, keyword, field: fields.join("|"), sort },
    "keyword|pipe|sort",
  ]);
  attempts.push([
    { ...BASE, keyword, field: fields.join("|") },
    "keyword|pipe|nosort",
  ]);
  attempts.push([
    { ...BASE, q: keyword, field: fields.join("|"), sort },
    "q|pipe|sort",
  ]);
  attempts.push([
    { ...BASE, q: keyword, field: fields.join("|") },
    "q|pipe|nosort",
  ]);

  const kParams = { ...BASE, keyword, sort };
  fields.forEach(
    (f) => (kParams.field = kParams.field ? [].concat(kParams.field, f) : f)
  );
  attempts.push([kParams, "keyword|repeatFields|sort"]);

  const qParams = { ...BASE, q: keyword, sort };
  fields.forEach(
    (f) => (qParams.field = qParams.field ? [].concat(qParams.field, f) : f)
  );
  attempts.push([qParams, "q|repeatFields|sort"]);

  fields.forEach((f) => {
    attempts.push([
      { ...BASE, keyword, field: f, sort },
      `keyword|single(${f})|sort`,
    ]);
    attempts.push([
      { ...BASE, q: keyword, field: f, sort },
      `q|single(${f})|sort`,
    ]);
  });

  const collected = [];
  for (const [params, label] of attempts) {
    const r = await tryFetch(params, label);
    if (r.ok && r.items.length) collected.push(...r.items);
  }
  const seen = new Set();
  const dedup = [];
  for (const it of collected) {
    const key = it.id ?? it.meetId ?? it.meetingId ?? JSON.stringify(it);
    if (!seen.has(key)) {
      seen.add(key);
      dedup.push(it);
    }
  }
  return dedup;
}

export default function Search() {
  const navigate = useNavigate();
  const userId = useMemo(() => Number(localStorage.getItem("uid") || 1), []);

  const [mode, setMode] = useState("all");
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    const kw = query.trim();
    if (!kw) {
      setResult([]);
      setLoading(false);
      return;
    }
    const fields = MODE_FIELDS[mode] || MODE_FIELDS.all;
    const normalized = mode === "tag" ? kw.replace(/^#/, "") : kw;

    setLoading(true);
    const ac = new AbortController();
    const timeout = setTimeout(() => ac.abort(), 8000);

    (async () => {
      const apiItems = await queryApi(
        { keyword: normalized, userId, fields },
        ac.signal
      );
      const mapped = apiItems.map(mapApiToMeeting).map((m, idx) => ({
        ...m,
        id: m.id ?? idx,
      }));
      setResult(mapped);
      setLoading(false);
    })();

    return () => {
      clearTimeout(timeout);
      ac.abort();
    };
  }, [query, mode, userId]);

  const showHint = !query.trim() && !loading;
  const showEmpty = !!query.trim() && !loading && result.length === 0;

  const handleSubmit = () => setQuery((q ?? "").trim());

  const handleClear = () => {
    setQ("");
    setQuery("");
    setResult([]);
    setLoading(false);
    inputRef.current?.focus?.();
  };

  const placeholder = PLACEHOLDER_BY_MODE[mode] || PLACEHOLDER_BY_MODE.all;

  return (
    <main className="search-page">
      <div className="phone">
        <div className="search-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <img src={leftIcon} alt="뒤로가기" />
          </button>

          <Searchbar
            ref={inputRef}
            value={q}
            onChange={(v) =>
              setQ(typeof v === "string" ? v : v?.target?.value ?? "")
            }
            onSubmit={handleSubmit}
            onClear={handleClear}
            placeholder={placeholder}
          />
        </div>

        {/* 검색 방식 (칩 버튼 스타일 DropDown) */}
        <div className="search-controls">
          <DropDown
            options={MODE_OPTIONS}
            value={mode}
            onChange={setMode}
            variant="light"
          />
        </div>

        {showHint && (
          <section className="search-hint">
            예) 마포구 산책, 러닝, 독서, 스터디 …
          </section>
        )}

        {loading && (
          <section className="skel-section">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </section>
        )}

        {showEmpty && (
          <section className="empty">
            <p>검색 결과가 없어요. 다른 키워드를 시도해 보세요.</p>
          </section>
        )}

        {!loading && result.length > 0 && (
          <div className="search-results">
            {result.map((m) => (
              <div key={m.id} className="result-row">
                <Link
                  to={`/meeting/${m.id}`}
                  state={{ meeting: m._raw ?? m }}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "block",
                  }}
                >
                  {/* ✅ picture 포함 */}
                  <MeetingShort {...m} />
                </Link>
              </div>
            ))}
          </div>
        )}

        <div className="nav-spacer" />
        <Navbar />
      </div>
    </main>
  );
}
