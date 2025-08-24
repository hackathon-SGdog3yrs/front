// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import PhoneLayout from "./layouts/PhoneLayout.jsx";
import Home from "./pages/Home.jsx";
import Search from "./pages/Search.jsx";
import MyPage from "./pages/MyPage.jsx";
import Create from "./pages/Create.jsx";
import MeetingDetailPage from "./pages/MeetingDetailPage.jsx";
import AiRecommend from "./pages/AiRecommend.jsx";
import LocationPage from "./pages/LocationPage.jsx"; // ✅ 장소 선택 페이지 추가

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ 공통 폰 레이아웃 */}
        <Route element={<PhoneLayout />}>
          {/* 메인 */}
          <Route path="/" element={<Home />} />
          {/* AI 추천 */}
          <Route path="/ai" element={<AiRecommend />} />
          {/* 검색 */}
          <Route path="/search" element={<Search />} />
          {/* 내 정보 */}
          <Route path="/me" element={<MyPage />} />
          {/* 모임 생성 */}
          <Route path="/create" element={<Create />} />
          {/* 장소 선택 */}
          <Route path="/locationpage" element={<LocationPage />} /> {/* ✅ 추가된 라우트 */}
          {/* 모임 상세 */}
          <Route path="/meeting/:id" element={<MeetingDetailPage />} />
          {/* (호환) /meetings/:id 도 지원 */}
          <Route path="/meetings/:id" element={<MeetingDetailPage />} />
        </Route>

        {/* 없는 주소 → 홈으로 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
