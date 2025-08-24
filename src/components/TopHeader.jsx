// src/components/TopHeader.jsx
import { useNavigate } from "react-router-dom";
import LeftIcon from "../assets/left.svg?react";
import "../styles/TopHeader.css";

/**
 * 상단 헤더
 * - 기본: fixed 고정 + spacer 로 레이아웃 보정
 * - sticky 로 사용하려면 <TopHeader fixed={false} /> 전달
 */
export default function TopHeader({
  title = "모임 생성",
  onBack, // 선택: 커스텀 뒤로가기 핸들러
  right, // 선택: 우측 슬롯 (버튼 등)
  className = "", // 선택: 추가 클래스
  fixed = true, // 기본 고정, false면 sticky로 동작
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) return onBack();
    // 🔽 이전 페이지로가 아니라 홈으로 이동
    navigate("/", { replace: true });
  };

  const headerClass =
    "top-header " +
    (fixed ? "top-header--fixed" : "top-header--sticky") +
    (className ? ` ${className}` : "");

  return (
    <>
      <header className={headerClass}>
        <button
          type="button"
          className="back-btn"
          onClick={handleBack}
          aria-label="뒤로가기"
          title="뒤로가기"
        >
          <LeftIcon className="back-icon" aria-hidden="true" />
          <span className="sr-only">뒤로가기</span>
        </button>

        <h1 className="title">{title}</h1>

        <div className="right-slot">{right}</div>
      </header>

      {fixed && <div className="top-header-spacer" aria-hidden="true" />}
    </>
  );
}
