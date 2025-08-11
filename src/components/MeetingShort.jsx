// MeetingShort.jsx
import React from "react";
import Thumb from "../assets/rectangle_big.svg?react";
import CalendarIcon from "../assets/calendar.svg?react";
import LocationIcon from "../assets/default.svg?react";
import MemberIcon from "../assets/person.svg?react";
import "../styles/MeetingShort.css";

/**
 * props
 * - title: string
 * - description?: string  // 또는 body
 * - body?: string
 * - date: string
 * - location: string
 * - members: { current: number, max: number, highlightColor?: string }
 */
export default function MeetingShort({
  title,
  description,
  body, // ← 추가
  time,
  location,
  currentCount,
  maxCount,
  highlightColor
}) {
  const desc = description ?? body ?? ""; // ← 둘 다 지원

  return (
    <article className="ms-card" role="listitem">
      <div className="ms-thumb">
        <Thumb />
      </div>

      <div className="ms-content">
        <h3 className="ms-title">{title}</h3>
        {/* 본문 */}
        <p className="ms-desc">{desc}</p>

        <div className="ms-meta">
          <span className="ms-meta__item">
            <LocationIcon className="ms-icon" />
            {location}
          </span>
          <span className="ms-meta__item">
            <CalendarIcon className="ms-icon" />
            {time}
          </span>

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
