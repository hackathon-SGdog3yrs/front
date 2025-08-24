// src/components/JoinButton.jsx
import React from "react";
import "../styles/JoinButton.css";

/**
 * joined 또는 isJoined 값에 따라 버튼 상태/라벨 토글
 * - active=true  → "참여 취소" (joined 클래스)
 * - active=false → "모임 참여" (not-joined 클래스)
 */
export default function JoinButton({ joined, isJoined, onClick, disabled }) {
  const active = typeof joined === "boolean" ? joined : Boolean(isJoined);

  const className = `join-button ${active ? "joined" : "not-joined"}`;
  const label = active ? "참여 취소" : "모임 참여";

  return (
    <div className="join-button-container">
      <button
        type="button"
        className={className}
        onClick={onClick}
        disabled={disabled}
        aria-pressed={active}
        data-state={active ? "joined" : "not-joined"}
      >
        {label}
      </button>
    </div>
  );
}
