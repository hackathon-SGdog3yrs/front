// src/components/Searchbar.jsx
import searchIcon from "../assets/search_icon.svg";
import "../styles/Searchbar.css";

export default function Searchbar({ value, onChange, onSubmit }) {
  return (
    <form className="searchbar__inner" onSubmit={onSubmit}>
      <input
        className="search-input"
        type="text"
        placeholder="검색어를 입력하세요"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button type="submit" className="search-btn">
        <img src={searchIcon} alt="검색" />
      </button>
    </form>
  );
}
