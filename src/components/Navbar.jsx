import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavItem from "./NavItem";

// assets 아이콘 (SVG를 리액트 컴포넌트로)
import ChatIcon from "../assets/chatting.svg?react";
import HomeIcon from "../assets/home_icon.svg?react";
import PlusIcon from "../assets/create.svg?react";
import MeIcon from "../assets/my_page.svg?react";

import "../styles/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // 경로 → 활성 탭 매핑 (뒤로가기/새로고침에도 정확)
  const activeId = useMemo(() => {
    if (pathname === "/") return "home";
    if (pathname.startsWith("/me")) return "me";
    if (pathname.startsWith("/search")) return "chat";
    if (pathname.startsWith("/create")) return "create";
    return "";
  }, [pathname]);

  const items = [
    { id: "chat",   label: "AI 추천",  Icon: ChatIcon, to: "/search" },
    { id: "home",   label: "메인 화면", Icon: HomeIcon, to: "/" },
    { id: "create", label: "모임 생성", Icon: PlusIcon, to: "/create" }, // 라우트 없으면 나중에 추가/변경
    { id: "me",     label: "내 정보",   Icon: MeIcon,   to: "/me" },     // ✅ 여기로 이동
  ];

  return (
    <div className="navwrap">
      <nav className="navbar" role="navigation" aria-label="하단 네비게이션">
        {items.map(({ id, label, Icon, to }) => (
          <NavItem
            key={id}
            label={label}
            Icon={Icon}
            active={activeId === id}
            onClick={() => navigate(to)}  // ✅ 클릭 시 화면 이동
          />
        ))}
      </nav>
    </div>
  );
}
