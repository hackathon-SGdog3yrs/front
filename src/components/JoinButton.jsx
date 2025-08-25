// src/components/JoinButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/JoinButton.css";

/**
 * joined 또는 isJoined 값에 따라 버튼 상태/라벨 토글
 * - active=true  → "참여 취소" (joined 클래스)
 * - active=false → "모임 참여" (not-joined 클래스)
 *
 * 클릭 후 기본적으로 홈("/")으로 이동합니다.
 */
export default function JoinButton({
  joined,
  isJoined,
  onClick,
  disabled,
  redirectTo = "/", // 필요하면 다른 경로로 바꿔서 사용 가능
}) {
  const navigate = useNavigate();
  const active = typeof joined === "boolean" ? joined : Boolean(isJoined);

  const className = `join-button ${active ? "joined" : "not-joined"}`;
  const label = active ? "참여 취소" : "모임 참여";

  const handleClick = async (e) => {
    if (disabled) return;
    try {
      const maybePromise = onClick?.(e);
      if (maybePromise && typeof maybePromise.then === "function") {
        await maybePromise; // 비동기 처리 끝난 뒤 이동
      }
    } finally {
      navigate(redirectTo, { replace: false });
    }
  };

  return (
    <div className="join-button-container">
      <button
        type="button"
        className={className}
        onClick={handleClick}
        disabled={disabled}
        aria-pressed={active}
        data-state={active ? "joined" : "not-joined"}
      >
        {label}
      </button>
    </div>
  );
}
