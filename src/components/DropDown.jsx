import React, { useRef } from "react";
import "../styles/DropDown.css";

/**
 * DropDown (chip buttons version)
 *
 * props:
 * - options: Array<string | { label, value }>
 * - value:   현재 선택 값
 * - onChange(nextValue)
 * - variant: "light" | "solid"  (색상 테마)
 * - className
 */
export default function DropDown({
  options = [],
  value,
  onChange,
  variant = "light",
  className = "",
  ariaLabel = "검색 방식 선택",
}) {
  // 문자열 옵션도 {label, value}로 정규화
  const items = options.map((o) =>
    typeof o === "string" ? { label: o, value: o } : o
  );

  const rowRef = useRef(null);

  const focusAt = (i) => {
    const chips = rowRef.current?.querySelectorAll(".chip");
    if (!chips || !chips.length) return;
    const idx = (i + chips.length) % chips.length;
    chips[idx]?.focus();
  };

  const onChipKeyDown = (e, idx, val) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      focusAt(idx + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusAt(idx - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusAt(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusAt(items.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onChange?.(val);
    }
  };

  return (
    <div className={`dropdown chips dd--${variant} ${className}`}>
      <div
        ref={rowRef}
        className="chips-row"
        role="radiogroup"
        aria-label={ariaLabel}
      >
        {items.map((it, i) => {
          const active = value === it.value;
          return (
            <button
              key={it.value}
              type="button"
              className={`chip ${active ? "is-active" : ""}`}
              role="radio"
              aria-checked={active}
              onClick={() => onChange?.(it.value)}
              onKeyDown={(e) => onChipKeyDown(e, i, it.value)}
            >
              {it.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
