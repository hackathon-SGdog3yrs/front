// src/components/ChatInputBar.jsx
import JoinInput from "./JoinInput";
import "../styles/JoinInput.css"; // JoinInput 스타일 재사용
import "../styles/ChatInputBar.css"; // 하단 고정용(아래 2번)

export default function ChatInputBar({
  value,
  onChange, // (e) => void
  onSubmit, // (text) => void
  sending = false,
  placeholder = "메시지를 입력하세요",
  onRecommend, // 선택: () => void (추천보기 버튼)
  error, // 선택: string (JoinInput의 에러 표기 그대로 사용)
  helper, // 선택: string
  maxLength, // 선택
  inputMode, // 선택: "text"|"numeric"...
  readOnly = false,
}) {
  const disabled = sending || !value?.trim();

  const handleSubmit = (e) => {
    e?.preventDefault();
    const text = (value || "").trim();
    if (!text || sending) return;
    onSubmit?.(text);
  };

  return (
    <form className="chat-inputbar" onSubmit={handleSubmit}>
      <div className="chat-inputbar__inner">
        <JoinInput
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          error={error}
          helper={helper}
          maxLength={maxLength}
          inputMode={inputMode}
          readOnly={readOnly}
          // JoinInput의 우측 슬롯에 전송 버튼 삽입
          rightSlot={
            <button
              type="submit"
              className="chat-send-btn"
              disabled={disabled}
              aria-label="메시지 전송"
              title="전송"
            >
              전송
            </button>
          }
        />
        {onRecommend && (
          <button
            type="button"
            className="chat-reco-btn"
            onClick={onRecommend}
            disabled={sending}
          >
            추천
          </button>
        )}
      </div>
    </form>
  );
}
