// src/components/MyPageTopBar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import LeftArrow from "../assets/left.svg";
import "../styles/MyPageTopBar.css";

const MyPageTopBar = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    // 이전 페이지 대신 홈으로 이동
    navigate("/", { replace: true });
  };

  return (
    <div className="M-top-bar-container">
      <button
        onClick={handleGoBack}
        className="back-button"
        aria-label="홈으로"
      >
        <img src={LeftArrow} alt="" className="back-icon" />
      </button>
      <h1 className="M-page-title">내 정보</h1>
    </div>
  );
};

export default MyPageTopBar;
