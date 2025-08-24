// src/components/Searchbar.jsx
import searchIcon from "../assets/search_icon.svg";
import "../styles/Searchbar.css";

export default function Searchbar({ value, onChange, onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault(); // ✅ 새로고침 방지
    onSubmit?.();
  };

  return (
    <form className="searchbar__inner" onSubmit={handleSubmit} role="search">
      <input
        className="search-input"
        type="text"
        placeholder="검색어를 입력하세요"
        value={value}
        onChange={(e) => onChange?.(e.target.value)} // ✅ 문자열만 전달
      />
      <button type="submit" className="search-btn" aria-label="검색">
        <img src={searchIcon} alt="" />
      </button>
    </form>
  );
}
