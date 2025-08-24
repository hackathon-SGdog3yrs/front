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

  // ✅ '/me' 는 매칭, '/meeting' 은 불일치
  const isUnder = (base) =>
    pathname === base || pathname.startsWith(`${base}/`);

  const activeId = useMemo(() => {
    if (pathname === "/" || isUnder("/meeting")) return "home";
    if (isUnder("/ai")) return "chat"; // /ai 및 /ai/...만
    if (isUnder("/create") || isUnder("/locationpage")) return "create"; // /create 및 하위만
    if (isUnder("/me")) return "me"; // /me 및 하위만
    return ""; // /meeting 등은 전부 회색(비활성)
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
