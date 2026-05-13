import { ReactElement, useMemo, useState } from "react";

type PlayButtonProps = {
  label?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  icon?: ReactElement;
};

export default function Button({
  label = "Play",
  disabled = false,
  loading = false,
  onClick,
  className,
  icon,
}: PlayButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const buttonStyle = useMemo(() => {
    if (disabled) {
      return {
        backgroundColor: "#262b35",
        borderColor: "#3c4350",
        color: "#8a96a8",
        cursor: "not-allowed",
        opacity: 0.7,
      };
    }

    if (isPressed) {
      return {
        backgroundColor: "#2a3039",
        borderColor: "#4a5362",
        color: "#f2f6fa",
        cursor: "pointer",
        opacity: 1,
      };
    }

    if (isHovered) {
      return {
        backgroundColor: "#3a424f",
        borderColor: "#596578",
        color: "#f2f6fa",
        cursor: "pointer",
        opacity: 1,
      };
    }

    return {
      backgroundColor: "#323844",
      borderColor: "#485160",
      color: "#d6dee8",
      cursor: "pointer",
      opacity: 1,
    };
  }, [disabled, isHovered, isPressed]);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        minWidth: "84px",
        height: "42px",
        padding: "0 16px",
        borderRadius: "13px",
        borderStyle: "solid",
        borderWidth: "1px",
        fontSize: "20px",
        fontWeight: 600,
        lineHeight: 1,
        letterSpacing: "0.2px",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        transition:
          "background-color 120ms ease, border-color 120ms ease, color 120ms ease, transform 70ms ease",
        transform: isPressed && !disabled ? "scale(0.98)" : "scale(1)",
        ...buttonStyle,
      }}
    >
      {loading ? (
        <span
          style={{
            width: "16px",
            height: "16px",
            borderRadius: "999px",
            border: "2px solid #8b9ab0",
            borderTopColor: "#f2f6fa",
            display: "inline-block",
            animation: "lyra-play-spin 0.7s linear infinite",
          }}
        />
      ) : icon ? (
        icon
      ) : null
      }
      <span>{label}</span>
      <style>
        {`@keyframes lyra-play-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }`}
      </style>
    </button>
  );
}
