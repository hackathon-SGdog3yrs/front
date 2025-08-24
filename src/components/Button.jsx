import React from "react";
import "../styles/Button.css";

/**
 * Props
 * - variant: "primary" | "ghost" | "secondary"
 * - children: 버튼 내용(텍스트)
 * - leftIcon?: ReactNode
 * - rightIcon?: ReactNode
 * - fullWidth?: boolean (true면 flex: 1)
 * - onClick?: () => void
 * - disabled?: boolean
 */
export default function Button({
  variant = "primary",
  children,
  leftIcon,
  rightIcon,
  fullWidth = false,
  onClick,
  disabled = false,
}) {
  return (
    <button
      type="button"
      className={`btn btn--${variant} ${fullWidth ? "btn--full" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {leftIcon && <span className="btn__icon">{leftIcon}</span>}
      <span className="btn__label">{children}</span>
      {rightIcon && <span className="btn__icon">{rightIcon}</span>}
    </button>
  );
}
