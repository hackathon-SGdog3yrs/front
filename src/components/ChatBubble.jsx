// src/components/ChatBubble.jsx
import "../styles/ChatBubble.css";

/**
 * 대화 말풍선
 *
 * props:
 * - who: "me" | "bot" (기본: "bot")
 * - text: string | JSX  (children로도 가능)
 * - time: string        (옵션, 말풍선 끝에 회색 타임스탬프)
 * - isTyping: boolean   (옵션, 점점점 애니메이션 표시)
 *
 * 사용 예:
 *  <ChatBubble who="me" text="안녕!" />
 *  <ChatBubble who="bot">추천을 불러오는 중…</ChatBubble>
 *  <ChatBubble who="bot" isTyping />
 */
export default function ChatBubble({
  who = "bot",
  text,
  children,
  time,
  isTyping = false,
}) {
  const me = who === "me";
  const content = text ?? children;

  return (
    <div className={`chatline ${me ? "me" : "bot"}`}>
      {/* 아바타 제거 버전: 좌측 아이콘 없이 말풍선만 렌더링 */}
      <div className={`bubble ${me ? "mine" : "theirs"}`}>
        {isTyping ? (
          <span className="typing">
            <i />
            <i />
            <i />
          </span>
        ) : (
          content
        )}
        {time && <span className="time">{time}</span>}
      </div>
    </div>
  );
}
