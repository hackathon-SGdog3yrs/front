// Search.jsx
import Navbar from "../components/Navbar";
import MeetingShort from "../components/MeetingShort";
import Searchbar from "../components/Searchbar";
import meetings from "../data/meeting";
import { useNavigate } from "react-router-dom";
import leftIcon from "../assets/left.svg";
import "../styles/Search.css";

export default function Search() {
  const navigate = useNavigate();

  return (
    <div className="screen">
      <div className="phone">
        {/* 상단 검색 영역 */}
        <div className="search-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <img src={leftIcon} alt="뒤로가기" />
          </button>
          <Searchbar />
        </div>

        {/* 검색 결과 리스트 */}
        <div className="search-results">
          {meetings.map((m, idx) => (
            <MeetingShort key={idx} {...m} />
          ))}
        </div>

        {/* 하단 네비 */}
        <div className="nav-spacer" />
        <Navbar />
      </div>
    </div>
  );
}
