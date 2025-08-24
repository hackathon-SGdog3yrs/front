import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import UpIcon from "../assets/Up.svg?react"; // ↑ 아이콘

/**
 * 시안형 채팅 입력 바
 *
 * props:
 *  - value, onChange         (있으면 controlled)
 *  - onSubmit(text) | onSend(text)
 *  - onRecommend()
 *  - disabled
 *  - placeholder
 *  - className
 *  - autoFocus (기본 false)  ← 변경
 */
export default function ChatInputBar2({
  value, // undefined면 언컨트롤드
  onChange,
  onSubmit,
  onSend, // 별칭 지원
  onRecommend,
  disabled = false,
  placeholder = "메시지를 입력하세요.",
  className = "",
  autoFocus = false, // ← 기본값을 false로 변경
}) {
  // controlled 여부
  const isControlled = useMemo(
    () => value !== undefined && typeof onChange === "function",
    [value, onChange]
  );

  // 언컨트롤드 내부 상태
  const [inner, setInner] = useState(value ?? "");
  useEffect(() => {
    if (value !== undefined) setInner(value ?? "");
  }, [value]);

  const current = isControlled ? value ?? "" : inner;

  // 입력창 ref (전송 후 재포커스)
  const inputRef = useRef(null);
  const [isComposing, setIsComposing] = useState(false); // 한글 IME 조합중

  const setFocus = () => {
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      setTimeout(() => inputRef.current?.focus(), 0);
    });
  };

  const handleInputChange = (e) => {
    const v = e.target.value;
    if (isControlled) onChange(v);
    else setInner(v);
  };

  const canSend = !disabled && current.trim().length > 0;

  const actuallySend = useCallback(() => {
    if (!canSend) return;
    if (typeof onSubmit === "function") onSubmit(current);
    else if (typeof onSend === "function") onSend(current);
    if (!isControlled) setInner("");
    setFocus(); // 전송 후에도 입력창에 계속 포커스
  }, [canSend, current, isControlled, onSubmit, onSend]);

  // 엔터로 전송 (한글 조합 중에는 전송 금지)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      actuallySend();
    }
  };

  return (
    <div
      className={`chatbar2 ${className}`}
      // 바 아무 곳이나 탭하면 입력창에 포커스
      onClick={(e) => {
        if (e.target !== inputRef.current) setFocus();
      }}
    >
      <div className="chatbar2-inner">
        {/* 왼쪽 칩 버튼 */}
        <button
          type="button"
          className="chatbar2-chip"
          onClick={() => {
            onRecommend?.();
            setFocus(); // 칩 눌러도 입력창 포커스
          }}
          aria-label="추천 모임 보기"
          onMouseDown={(e) => e.preventDefault()} // 포커스 뺏기 방지
          onTouchStart={(e) => e.preventDefault()}
        >
          추천모임
        </button>

        {/* 입력창 + 내부 전송 버튼 (겹침) */}
        <div className="chatbar2-field">
          <input
            ref={inputRef}
            className="chatbar2-input"
            placeholder={placeholder}
            value={current}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            disabled={disabled}
            autoFocus={autoFocus} // 기본 false라 초기 자동 포커스 안 됨
            enterKeyHint="send"
          />

          <button
            type="button"
            className="chatbar2-send in-input"
            aria-label="전송"
            disabled={!canSend}
            tabIndex={-1}
            onMouseDown={(e) => e.preventDefault()}
            onTouchStart={(e) => e.preventDefault()}
            onClick={actuallySend}
          >
            <UpIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
