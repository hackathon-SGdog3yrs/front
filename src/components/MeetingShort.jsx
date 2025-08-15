// src/components/MeetingShort.jsx
import React from "react";
import Thumb from "../assets/rectangle_big.svg?react";
import CalendarIcon from "../assets/calendar.svg?react";
import LocationIcon from "../assets/default.svg?react";
import MemberIcon from "../assets/person.svg?react";
import "../styles/MeetingShort.css";

/**
 * props
 * - title: string
 * - description?: string | body?: string
 * - time: string
 * - location: string
 * - currentCount: number
 * - maxCount: number
 * - highlightColor?: string
 */
export default function MeetingShort({
  title,
  description,
  body,
  time,
  location,
  currentCount,
  maxCount,
  highlightColor,
}) {
  const desc = description ?? body ?? "";

  // 주소를 "앞부분(콤마 포함)" + "뒷부분"으로 분리
  const splitLocation = (loc = "") => {
    const i = loc.indexOf(",");
    if (i === -1) return { prefix: loc, suffix: "" };
    return {
      prefix: loc.slice(0, i + 1) + " ", // "마포구 백범로 35, "
      suffix: loc.slice(i + 1).trim(), // "우정원 700호"
    };
  };
  const { prefix, suffix } = splitLocation(location);

  return (
    <article className="ms-card" role="listitem">
      {/* 썸네일 */}
      <div className="ms-thumb" aria-hidden="true">
        <Thumb />
      </div>

      {/* 본문 */}
      <div className="ms-content">
        <h3 className="ms-title">{title}</h3>

        {/* 설명 */}
        <p className="ms-desc">{desc}</p>

        {/* 메타 정보 */}
        <div className="ms-meta">
          {/* 주소: 한 줄 전체, 콤마 뒤 첫 글자까지만 보이고 … */}
          <span className="ms-meta__item ms-meta__item--full">
            <LocationIcon className="ms-icon" />
            <span className="ms-meta__text">
              <span className="loc-prefix">{prefix}</span>
              {suffix && <span className="loc-suffix-ellipsis">{suffix}</span>}
            </span>
          </span>

          {/* 시간 */}
          <span className="ms-meta__item">
            <CalendarIcon className="ms-icon" />
            <span className="ms-meta__text">{time}</span>
          </span>

          {/* 인원 */}
          <span className="ms-meta__item">
            <MemberIcon className="ms-icon" />
            <span
              className="ms-members-current"
              style={{ color: highlightColor || "inherit" }}
            >
              {currentCount}
            </span>
            {" / "}
            {maxCount}
          </span>
        </div>
      </div>
    </article>
  );
}
