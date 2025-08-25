// src/components/Navbar.jsx
import { useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavItem from "./NavItem";

import ChatIcon from "../assets/chatting.svg?react";
import HomeIcon from "../assets/home_icon.svg?react";
import PlusIcon from "../assets/create.svg?react";
import MeIcon from "../assets/my_page.svg?react";

import "../styles/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // ✅ base 경로와 그 하위를 매칭(예: "/ai" 또는 "/ai/...") 
  const isUnder = (base) =>
    pathname === base || pathname.startsWith(`${base}/`);

  const activeId = useMemo(() => {
    // 홈 활성: 루트(/), 모임 상세(/meeting/*), 검색(/search/*)
    if (pathname === "/" || isUnder("/meeting") || isUnder("/search")) {
      return "home";
    }
    // AI 추천 활성: /ai/*
    if (isUnder("/ai")) return "chat";
    // 생성/위치 관련 활성: /create/*, /locationpage/*
    if (isUnder("/create") || isUnder("/locationpage")) return "create";
    // 내 정보 활성: /me/*
    if (isUnder("/me")) return "me";
    // 그 외: 모두 비활성(회색)
    return "";
  }, [pathname]);

  const items = useMemo(
    () => [
      { id: "chat", label: "AI 추천", Icon: ChatIcon, to: "/ai" },
      { id: "home", label: "메인 화면", Icon: HomeIcon, to: "/" },
      { id: "create", label: "모임 생성", Icon: PlusIcon, to: "/create" },
      { id: "me", label: "내 정보", Icon: MeIcon, to: "/me" },
    ],
    []
  );

  const handleNavigate = useCallback(
    (to) => {
      if (pathname !== to) navigate(to);
    },
    [navigate, pathname]
  );

  return (
    <div className="navwrap">
      <nav className="navbar" role="navigation" aria-label="하단 네비게이션">
        {items.map(({ id, label, Icon, to }) => (
          <NavItem
            key={id}
            label={label}
            Icon={Icon}
            active={activeId === id}
            onClick={() => handleNavigate(to)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleNavigate(to);
              }
            }}
            role="button"
            tabIndex={0}
            aria-current={activeId === id ? "page" : undefined}
          />
        ))}
      </nav>
    </div>
  );
}
