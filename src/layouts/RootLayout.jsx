import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function RootLayout() {
  return (
    <>
      <Outlet />
      <Navbar /> {/* 하단 고정 네비 */}
    </>
  );
}
