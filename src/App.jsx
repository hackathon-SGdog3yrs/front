// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Search from "./pages/Search.jsx"; // ✅ 검색 페이지 import

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 홈 */}
        <Route path="/" element={<Home />} />

        {/* 검색 */}
        <Route path="/search" element={<Search />} />

        {/* 없는 주소 → 홈으로 리다이렉트 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
