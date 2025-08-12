import Location from "../components/Location";
import Navbar from "../components/Navbar";
import MeetingShort from "../components/MeetingShort";
import TopBar from "../components/TopBar";
import Button from "../components/Button";
import meetings from "../data/meeting"; // ✅ 더미데이터 불러오기
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  
  return (
    <div className="screen">
      <div className="phone">
        {/* 상단바 */}
        <TopBar sticky onSearchClick={() => navigate("/search")} />

        {/* 메인 타이틀 */}
        <h2 className="home-title">오늘은 어떤 모임에{"\n"}참여해볼까요?</h2>

        {/* 위치/지역 변경 */}
        <div className="row">
          <Location />
        </div>

        {/* 액션 버튼 */}
        <div className="actions">
          <Button variant="primary" fullWidth>
            AI 추천
          </Button>
          <Button variant="ghost" fullWidth>
            모임 생성
          </Button>
        </div>

        {/* 모임 리스트 - meetings 배열 반복 렌더링 */}
        <div className="list">
          {meetings.map((meeting, idx) => (
            <MeetingShort key={idx} {...meeting} />
          ))}
        </div>

        {/* 하단 네비게이션 */}
        <div className="nav-spacer" />
        <Navbar />
      </div>
    </div>
  );
}
