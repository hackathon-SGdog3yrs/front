// src/layouts/PhoneLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/global.css";

export default function PhoneLayout() {
  const { pathname } = useLocation();
  const isAiPage = pathname === "/ai" || pathname.startsWith("/ai/");

  return (
    <div className="screen">
      <div
        className={`phone ${isAiPage ? "no-nav ai-recommend" : "has-nav"}`}
        data-route={pathname}
      >
        <Outlet />
        {!isAiPage && <Navbar />}
      </div>
    </div>
  );
}
