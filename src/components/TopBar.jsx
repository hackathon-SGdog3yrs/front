import React from "react";
// ⬇️ 여기만 교체
import Logo from "../assets/logo.svg?react";
import SearchIcon from "../assets/search_icon.svg?react";
import "../styles/TopBar.css";

// onSearchClick 콜백 그대로 유지
export default function TopBar({ sticky = true, onSearchClick, onLogoClick }) {
  return (
    <div className={`topbar-wrap ${sticky ? "sticky" : ""}`}>
      <header className="topbar" role="banner" aria-label="상단바">
        <div className="topbar-left">
          {/* 로고 클릭 시 홈으로 가고 싶으면 onLogoClick 전달 */}
          <button
            type="button"
            className="logo-btn"
            aria-label="홈으로 이동"
            onClick={onLogoClick}
          >
            <Logo className="logo" aria-hidden="true" focusable="false" />
          </button>
        </div>

        <div className="topbar-right">
          <button
            type="button"
            className="icon-btn"
            aria-label="검색"
            onClick={onSearchClick}
          >
            <SearchIcon />
          </button>
        </div>
      </header>
    </div>
  );
}
