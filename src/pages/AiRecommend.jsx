// src/pages/AiRecommend.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom"; // ✅ 추가
import ChatBubble from "../components/ChatBubble";
import TopHeader from "../components/TopHeader";
import MeetingHeader from "../components/MeetingHeader";
import ChatInputBar2 from "../components/ChatInputBar2";
import { chat, getRecommendations } from "../api";
import "../styles/AiRecommend.css";
import "../styles/ChatInputBar2.css";

/** 입력바 실제 높이를 측정해 CSS 변수 --chatbar-space 로 반영 */
function useChatbarSpace(
  selector = ".chatbar2",
  scopeSelector = ".phone.ai-recommend"
) {
  useEffect(() => {
    const bar = document.querySelector(selector);
    const scope =
      document.querySelector(scopeSelector) || document.documentElement;
    if (!bar || !scope) return;

    const update = () => {
      const h = bar.offsetHeight || 0; // padding 포함 높이
      scope.style.setProperty("--chatbar-space", `${h}px`);
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(bar);

    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [selector, scopeSelector]);
}

export default function AiRecommend() {
  // ✅ 입력바 높이 반영(가림 방지)
  useChatbarSpace();

  const userId = useMemo(() => Number(localStorage.getItem("uid") || 1), []);

  // 하나의 스트림으로 메시지/추천을 관리
  const [stream, setStream] = useState([
    { kind: "msg", who: "bot", text: "오늘 하루는 어떤가요?" },
  ]);

  const listRef = useRef(null);
  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [stream]);

  const [sending, setSending] = useState(false);

  // ✅ 상세 페이지로 이동에 필요한 최소 정보 + 원본 보존(_raw)
  const toHeaderData = (item) => ({
    id: item?.id ?? item?.meetId ?? item?.meetingId,
    name: item?.name ?? item?.title ?? "모임",
    intro: item?.intro ?? item?.detail ?? "",
    datetime: item?.datetime ?? item?.dateTime ?? item?.time ?? "",
    current: item?.current ?? item?.currentCount ?? item?.nowPeople ?? 0,
    maximum: item?.maximum ?? item?.maxCount ?? item?.maxPeople ?? 0,
    locationName: item?.locationName ?? item?.location ?? item?.placeName ?? "",
    locationPicture: item?.locationPicture ?? item?.pictures ?? [],
    hostName: item?.hostName ?? item?.ownerName ?? "",
    _raw: item, // ✅ 상세에 state로 넘길 때 사용할 원본
  });

  // 추천보기
  async function handleRecommend() {
    const pendingId = `reco-pending-${Date.now()}`;
    setStream((s) => [
      ...s,
      { kind: "msg", who: "bot", typing: true, id: pendingId },
    ]);

    try {
      const raw = await getRecommendations(userId);
      const arr = Array.isArray(raw)
        ? raw
        : raw?.data ?? raw?.result ?? raw?.items ?? [];
      const list = arr.slice(0, 3).map(toHeaderData).filter(Boolean);

      setStream((s) => {
        const i = s.findIndex((x) => x.id === pendingId);
        if (i < 0) return s;
        const next = [...s];
        next[i] = { kind: "reco", list, id: `reco-${Date.now()}` };
        return next;
      });
    } catch (e) {
      setStream((s) => {
        const i = s.findIndex((x) => x.id === pendingId);
        if (i < 0) return s;
        const next = [...s];
        next[i] = {
          kind: "msg",
          who: "bot",
          text: "추천모임을 불러오지 못했어요. 챗봇과 대화를 먼저 진행해주세요. ",
        };
        return next;
      });
    }
  }

  // 채팅 전송
  async function handleSend(text) {
    if (!text?.trim() || sending) return;
    const pendingId = `bot-pending-${Date.now()}`;
    setStream((s) => [...s, { kind: "msg", who: "me", text }]);
    setSending(true);

    setStream((s) => [
      ...s,
      { kind: "msg", who: "bot", typing: true, id: pendingId },
    ]);

    try {
      const data = await chat(userId, text);
      setStream((s) => {
        const i = s.findIndex((x) => x.id === pendingId);
        if (i < 0) return s;
        const next = [...s];
        next[i] = {
          kind: "msg",
          who: "bot",
          text: data?.reply ?? "응답 없음",
        };
        return next;
      });
    } catch {
      setStream((s) => {
        const i = s.findIndex((x) => x.id === pendingId);
        if (i < 0) return s;
        const next = [...s];
        next[i] = {
          kind: "msg",
          who: "bot",
          text: "연결이 잠시 불안정해요. 다시 시도해 주세요.",
        };
        return next;
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="phone ai-recommend">
      <TopHeader title="AI 추천" />
      <div className="top-header-spacer" />
      <div className="content" ref={listRef}>
        {stream.map((item, i) =>
          item.kind === "msg" ? (
            <ChatBubble
              key={item.id ?? `msg-${i}`}
              who={item.who}
              isTyping={item.typing}
            >
              {item.text}
            </ChatBubble>
          ) : (
            <div key={item.id ?? `reco-${i}`} className="reco-list">
              {item.list.map((data, k) => (
                <div key={data.id ?? `reco-item-${k}`} className="reco-item">
                  {/* ✅ 추천 카드 클릭 → 상세로 이동 */}
                  <Link
                    to={`/meeting/${data.id}`}
                    state={{ meeting: data._raw ?? data }}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      display: "block",
                    }}
                  >
                    <MeetingHeader data={data} />
                  </Link>
                </div>
              ))}
            </div>
          )
        )}
      </div>
      {/* 하단 입력바 */}
      <ChatInputBar2
        placeholder="메시지를 입력하세요."
        onSend={handleSend}
        onRecommend={handleRecommend}
        disabled={sending}
      />
    </div>
  );
}
