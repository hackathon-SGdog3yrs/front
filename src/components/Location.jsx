// src/components/Location.jsx
import React, { useState } from "react";
import PinIcon from "../assets/default.svg?react";
import RightArrow from "../assets/right.svg";
import "../styles/Location.css";

export default function Location({ location = "마포구 신수동", onChange }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // ✨ 드롭다운 상태 추가

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    // 드롭다운이 열릴 때 onChange 핸들러를 호출할 수도 있습니다.
    if (!isDropdownOpen && onChange) {
      onChange();
    }
  };

  return (
    <div
      className="loc-container"
      onClick={handleToggleDropdown}
      role="group"
      aria-label="현재 위치"
    >
      <div className="loc-left">
        <PinIcon className="loc-icon" aria-hidden="true" />
        <span className="loc-text">{location}</span>
      </div>
      <img
        src={RightArrow}
        alt="토글 아이콘"
        className={`toggle-icon ${isDropdownOpen ? "expanded" : ""}`}
      />

      {/* ✨ 드롭다운 내용 추가 */}
      {isDropdownOpen && (
        <div className="loc-dropdown-content">
          <p>{location}</p>
        </div>
      )}
    </div>
  );
}
