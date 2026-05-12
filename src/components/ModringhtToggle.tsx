type ModringhtToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  small?: boolean;
  id?: string;
  className?: string;
};

export default function ModringhtToggle({
  checked,
  onChange,
  disabled = false,
  small = false,
  id,
  className,
}: ModringhtToggleProps) {
  const trackHeight = small ? 20 : 24;
  const trackWidth = small ? 40 : 48;
  const knobSize = small ? 12 : 16;
  const knobLeft = small ? 4 : 4;
  const knobOnTranslate = small ? 20 : 24;

  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => {
        if (!disabled) onChange(!checked);
      }}
      className={className}
      style={{
        margin: 0,
        padding: "4px",
        width: `${trackWidth}px`,
        height: `${trackHeight}px`,
        border: "none",
        borderRadius: "999px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.2s ease",
        display: "inline-flex",
        alignItems: "center",
        position: "relative",
        backgroundColor: checked ? "var(--modringht-brand)" : "var(--modringht-bg-super-raised)",
      }}
    >
      <span
        style={{
          width: `${knobSize}px`,
          height: `${knobSize}px`,
          borderRadius: "999px",
          transition: "all 0.2s ease",
          position: "absolute",
          left: `${knobLeft}px`,
          transform: checked ? `translateX(${knobOnTranslate}px)` : "translateX(0)",
          backgroundColor: checked ? "rgba(0, 0, 0, 0.9)" : "var(--modringht-gray)",
        }}
      />
    </button>
  );
}

