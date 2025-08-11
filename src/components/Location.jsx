import PinIcon from "../assets/default.svg?react";
import "../styles/Location.css";

export default function Location({ location = "마포구 신수동", onChange }) {
  return (
    <div className="loc-container" role="group" aria-label="현재 위치">
      <div className="loc-left">
        <PinIcon className="loc-icon" aria-hidden />
        <span className="loc-text">{location}</span>
      </div>

      <button type="button" className="loc-change" onClick={onChange}>
        지역 변경
      </button>
    </div>
  );
}
