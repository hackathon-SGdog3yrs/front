// src/pages/Create.jsx
import { useMemo, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import JoinInput from "../components/JoinInput";
import LeftIcon from "../assets/left.svg?react";
import RightIcon from "../assets/right.svg?react";
import { createMeeting } from "../api";
import "../styles/Create.css";

const isValidTime = (s) => /^\d{2}:\d{2}$/.test(s || "");

function getLocationName(sel) {
  if (!sel) return "";
  if (typeof sel === "string") return sel.trim();
  const cands = [
    sel.name,
    sel.title,
    sel.placeName,
    sel.locationName,
    sel.label,
  ];
  for (const c of cands) if (typeof c === "string" && c.trim()) return c.trim();
  if (sel.address) {
    const a = sel.address;
    const addr =
      typeof a === "string"
        ? a
        : [a.si, a.gu, a.dong, a.road].filter(Boolean).join(" ");
    return addr.trim();
  }
  try {
    return JSON.stringify(sel);
  } catch {
    return String(sel);
  }
}

// '#런닝 #스터디' → ['런닝','스터디']
function tagsToArray(raw = "") {
  return raw
    .split(/\s+/)
    .map((t) => t.replace(/^#+/, "").trim())
    .filter(Boolean);
}

// 오늘 날짜 + HH:mm → 'YYYY-MM-DDTHH:mm:00'
function toKstDateTime(hhmm) {
  if (!isValidTime(hhmm)) return "";
  const [H, M] = hhmm.split(":").map(Number);
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const hh = String(H).padStart(2, "0");
  const mm = String(M).padStart(2, "0");
  return `${y}-${m}-${d}T${hh}:${mm}:00`;
}

// 로컬 저장: 마이페이지/홈에서 즉시 확인용
function saveCreatedMeetingLocal(userId, meeting) {
  const key = `created_meetings_user_${userId}`;
  const arr = JSON.parse(localStorage.getItem(key) || "[]");
  arr.unshift(meeting);
  localStorage.setItem(key, JSON.stringify(arr));
}

export default function Create() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [form, setForm] = useState({
    title: "",
    startTime: "",
    maxCount: "",
    tags: "",
    location: "",
    locationId: null,
    intro: "",
    detail: "",
  });
  const [touched, setTouched] = useState({});
  const [isComposing, setIsComposing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 장소 선택 후 복귀: draft 복원 + 선택 장소 반영
  useEffect(() => {
    const draft = state?.draft;
    const sel = state?.selectedLocation;
    if (draft && typeof draft === "object")
      setForm((f) => ({ ...f, ...draft }));
    if (sel) {
      const nameOnly = getLocationName(sel);
      const locId = sel.id ?? sel.locationId ?? null;
      setForm((f) => ({ ...f, location: nameOnly, locationId: locId }));
    }
    if (draft || sel) navigate(".", { replace: true, state: null });
  }, [state, navigate]);

  const setField = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const errors = useMemo(() => {
    const e = {};
    if (!form.title.trim()) e.title = "모임 이름을 입력해주세요.";
    if (!isValidTime(form.startTime))
      e.startTime = "시간은 00:00–23:59 형식이에요.";
    if (!/^\d+$/.test(form.maxCount) || Number(form.maxCount) <= 0)
      e.maxCount = "최대 인원은 1 이상의 숫자만 가능합니다.";

    const tagArr = tagsToArray(form.tags);
    if (tagArr.length < 1) e.tags = "태그는 최소 1개 입력해주세요.";
    else if (tagArr.length > 5)
      e.tags = "태그는 최대 5개까지 입력할 수 있어요.";

    if (!form.locationId) e.location = "장소를 선택해주세요.";
    if (!form.intro.trim()) e.intro = "한 줄 소개를 입력해주세요.";
    if (!form.detail.trim()) e.detail = "모임 설명을 입력해주세요.";
    return e;
  }, [form]);

  const isValid = Object.keys(errors).length === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      title: true,
      startTime: true,
      maxCount: true,
      tags: true,
      location: true,
      intro: true,
      detail: true,
    });
    if (!isValid || submitting) return;

    const userId = Number(localStorage.getItem("uid")) || 1;
    const payload = {
      name: form.title.trim(),
      datetime: toKstDateTime(form.startTime),
      maximum: Number(form.maxCount),
      detail: form.detail.trim(),
      tag: tagsToArray(form.tags).slice(0, 5),
      locationId: Number(form.locationId),
      userId,
      intro: form.intro.trim(),
    };

    try {
      setSubmitting(true);
      const res = await createMeeting(payload);

      const newId =
        res?.id ?? res?.meetId ?? res?.meetingId ?? `local-${Date.now()}`;

      // 홈/마이페이지에서 즉시 보이도록 로컬에도 저장
      saveCreatedMeetingLocal(userId, {
        id: newId,
        name: payload.name,
        title: payload.name,
        intro: payload.intro,
        detail: payload.detail,
        locationName: form.location,
        location: form.location,
        datetime: payload.datetime,
        time: form.startTime,
        current: 1,
        currentCount: 1,
        maximum: payload.maximum,
        maxCount: payload.maximum,
        hostId: userId,
        tags: payload.tag,
        _local: true,
      });

      alert("모임이 생성되었습니다! 마이페이지에서 확인하세요.");
      navigate("/", { replace: true, state: { justCreated: newId } });
    } catch (err) {
      console.error("createMeeting failed:", err);
      alert(
        "모임 생성에 실패했어요. 입력값을 확인하거나 잠시 후 다시 시도해주세요."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handlePickLocation = () => {
    navigate("/locationpage", { state: { from: "create", draft: form } });
  };

  return (
    <main className="create-page">
      <header className="create-header1">
        <button
          className="back-btn"
          onClick={() => navigate("/", { replace: true })}
          aria-label="홈으로"
          title="홈으로"
          type="button"
        >
          <LeftIcon className="back-icon" aria-hidden="true" />
        </button>
        <h1>모임 생성</h1>
      </header>

      <form className="create-form" onSubmit={handleSubmit} noValidate>
        <h2 className="section-title1">모임 기본 정보</h2>

        <JoinInput
          label="이름"
          placeholder="모임 이름을 입력해주세요."
          helper="예시) 서강개 3년이상"
          value={form.title}
          onChange={setField("title")}
          onBlur={() => setTouched((t) => ({ ...t, title: true }))}
          error={touched.title && errors.title}
        />

        <JoinInput
          label="시작 시간"
          placeholder="모임 시작 시간을 입력해주세요."
          helper="예시) 09:00"
          value={form.startTime}
          onChange={(e) => {
            const v = e.target.value.replace(/[^\d:]/g, "").slice(0, 5);
            e.target.value = v;
            setField("startTime")(e);
          }}
          onBlur={() => setTouched((t) => ({ ...t, startTime: true }))}
          error={touched.startTime && errors.startTime}
          inputMode="numeric"
          maxLength={5}
        />

        <JoinInput
          label="최대 인원수"
          placeholder="모임 최대 인원수를 입력해주세요."
          helper="예시) 100명"
          value={form.maxCount}
          onChange={(e) => {
            e.target.value = e.target.value.replace(/[^\d]/g, "");
            setField("maxCount")(e);
          }}
          onBlur={() => setTouched((t) => ({ ...t, maxCount: true }))}
          error={touched.maxCount && errors.maxCount}
          inputMode="numeric"
        />

        {/* 태그 (IME 대응) */}
        <JoinInput
          label="모임 태그"
          placeholder="예시) #운동 #스터디 (최소 1개)"
          helper="예시) #서강개#3년 / 최대 5개, #혹은 띄어쓰기로 구분"
          value={form.tags}
          onChange={(e) => {
            const v = e.target.value;
            if (isComposing || e.nativeEvent?.isComposing) {
              setForm((f) => ({ ...f, tags: v }));
              return;
            }
            let out = v;
            if (out && !out.startsWith("#")) out = "#" + out.replace(/^#+/, "");
            if (out.endsWith(" ")) out = out.trim() + "#";
            setForm((f) => ({ ...f, tags: out }));
          }}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={(e) => {
            setIsComposing(false);
            let out = e.target.value;
            if (out && !out.startsWith("#")) out = "#" + out.replace(/^#+/, "");
            setForm((f) => ({ ...f, tags: out }));
          }}
          onBlur={(e) => {
            setTouched((t) => ({ ...t, tags: true }));
            const arr = tagsToArray(e.target.value).slice(0, 5);
            setForm((f) => ({ ...f, tags: arr.map((t) => `#${t}`).join(" ") }));
          }}
          error={touched.tags && errors.tags}
        />

        {/* 장소 */}
        <div className="join-field">
          <div className="join-label">장소</div>
          <button
            type="button"
            className="input-button"
            onClick={handlePickLocation}
            aria-label="모임 장소를 선택해주세요."
          >
            <span
              className={
                form.location
                  ? "input-button__text"
                  : "input-button__placeholder"
              }
            >
              {form.location || "모임 장소를 선택해주세요."}
            </span>
            <RightIcon className="chevron-icon" aria-hidden="true" />
          </button>
          {touched.location && errors.location && (
            <div className="join-error">{errors.location}</div>
          )}
        </div>

        <h2 className="section-title1">모임 상세 정보</h2>

        <JoinInput
          label="한 줄 소개"
          placeholder="한 줄로 모임을 소개해주세요."
          value={form.intro}
          onChange={setField("intro")}
          onBlur={() => setTouched((t) => ({ ...t, intro: true }))}
          error={touched.intro && errors.intro}
          maxLength={60}
        />

        <JoinInput
          label="모임 설명"
          placeholder="모임에 대해 상세히 설명해주세요."
          value={form.detail}
          onChange={setField("detail")}
          onBlur={() => setTouched((t) => ({ ...t, detail: true }))}
          error={touched.detail && errors.detail}
        />

        <div className="submit-wrap">
          <button
            type="submit"
            className="submit-btn"
            disabled={!isValid || submitting}
          >
            {submitting ? "생성 중..." : "모임 참여"}
          </button>
        </div>
      </form>
    </main>
  );
}
