import { useState } from "react";
import NavItem from "./NavItem";

// assets 아이콘 (SVG를 리액트 컴포넌트로)
import ChatIcon from "../assets/chatting.svg?react";
import HomeIcon from "../assets/home_icon.svg?react";
import PlusIcon from "../assets/create.svg?react";
import MeIcon from "../assets/my_page.svg?react";

import "../styles/Navbar.css";

export default function Navbar() {
  const [active, setActive] = useState("home");

  const items = [
    { id: "chat", label: "AI 추천", Icon: ChatIcon },
    { id: "home", label: "메인 화면", Icon: HomeIcon },
    { id: "create", label: "모임 생성", Icon: PlusIcon },
    { id: "me", label: "내 정보", Icon: MeIcon },
  ];

  return (
    <div className="navwrap">
      <nav className="navbar" role="navigation">
        {items.map(({ id, label, Icon }) => (
          <NavItem
            key={id}
            label={label}
            Icon={Icon}
            active={active === id}
            onClick={() => setActive(id)}
          />
        ))}
      </nav>
    </div>
  );
}
