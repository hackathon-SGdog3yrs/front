import React from "react";
import { useNavigate } from "react-router-dom";
import LeftArrow from '../assets/left.svg'
import '../styles/TopBarDetail.css';

const TopBarDetail = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="top-bar-container">
      <button onClick={handleGoBack} className="back-button">
        <img src = {LeftArrow} alt="뒤로가기" className="back-icon" />
      </button>
      {/* <h1 className="page-title"></h1> */} 
    </div>
  )
}

export default TopBarDetail