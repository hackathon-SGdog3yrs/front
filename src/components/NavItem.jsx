import "../styles/NavItem.css";

export default function NavItem({ Icon, label, active, onClick }) {
  return (
    <button
      type="button"
      className={`nav-item ${active ? "active" : ""}`}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
    >
      <Icon className="nav-icon" aria-hidden />
      <span className="nav-label">{label}</span>
    </button>
  );
}
