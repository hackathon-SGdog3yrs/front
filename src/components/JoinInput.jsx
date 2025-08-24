import { useId } from "react";
import "../styles/JoinInput.css";

/**
 * 재사용 가능한 입력 컴포넌트
 * - helper(예시)는 항상 보임
 * - error가 있으면 helper 아래에 추가로 표시
 * - 포커스 초록, 에러 빨강 테두리(스타일 파일에서 처리)
 */
export default function JoinInput({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  helper,
  rightSlot,
  inputMode,
  maxLength,
  readOnly,
  type = "text",
  // 과거 호환: success는 더 이상 사용하지 않음
  success, // eslint-disable-line no-unused-vars
  onFocus,
}) {
  const hasError = Boolean(error);
  const uid = useId();
  const helperId = helper ? `${uid}-helper` : undefined;
  const errorId = hasError ? `${uid}-error` : undefined;
  const describedBy =
    [helperId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={`join-input ${hasError ? "has-error" : ""}`}>
      {label && (
        <label className="join-label" htmlFor={uid}>
          {label}
        </label>
      )}

      <div className="join-box">
        <input
          id={uid}
          type={type}
          className="join-control"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          inputMode={inputMode}
          maxLength={maxLength}
          readOnly={readOnly}
          aria-invalid={hasError ? "true" : "false"}
          aria-describedby={describedBy}
        />
        {rightSlot && <div className="join-right">{rightSlot}</div>}
      </div>

      {/* helper는 항상 표시 */}
      {helper && (
        <p id={helperId} className="join-helper">
          {helper}
        </p>
      )}

      {/* error는 helper 아래에 추가 표시 */}
      {hasError && (
        <p id={errorId} className="join-error" role="alert" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}
