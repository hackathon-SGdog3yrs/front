import React from "react";
import LogoRect from "../assets/rectangle.svg?react";
import SearchIcon from "../assets/search_icon.svg?react";
import "../styles/TopBar.css";

// ✅ onSearchClick 콜백 추가
export default function TopBar({ sticky = true, onSearchClick }) {
  return (
    <div className={`topbar-wrap ${sticky ? "sticky" : ""}`}>
      <header className="topbar" role="banner" aria-label="상단바">
        <div className="topbar-left">
          <LogoRect className="logo-rect" aria-label="앱 로고" />
        </div>

        <div className="topbar-right">
          {/* ✅ 클릭 시 부모(Home 등)에서 넘긴 콜백 실행 */}
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
