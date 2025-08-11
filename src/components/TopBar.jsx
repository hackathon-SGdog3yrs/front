import React from "react";
import LogoRect from "../assets/rectangle.svg?react"; // 회색 로고 플레이스홀더
import SearchIcon from "../assets/search_icon.svg?react"; // 검색 아이콘
import "../styles/TopBar.css";

export default function TopBar({ sticky = true }) {
  return (
    <div className={`topbar-wrap ${sticky ? "sticky" : ""}`}>
      <header className="topbar" role="banner" aria-label="상단바">
        {/* 좌: 로고 자리 (나중에 실제 로고로 교체) */}
        <div className="topbar-left">
          <LogoRect className="logo-rect" aria-label="앱 로고" />
        </div>

        {/* 우: 검색 버튼 */}
        <div className="topbar-right">
          <button className="icon-btn" aria-label="검색">
            <SearchIcon />
          </button>
        </div>
      </header>
    </div>
  );
}
