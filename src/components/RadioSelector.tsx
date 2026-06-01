type RadioSelectorOption = {
  value: string;
  label: string;
  description?: string;
};

type RadioSelectorProps = {
  name: string;
  options: RadioSelectorOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export default function RadioSelector({
  name,
  options,
  value,
  onChange,
  className,
}: RadioSelectorProps) {
  return (
    <div
      role="radiogroup"
      aria-label={name}
      className={"grid grid-cols-1 gap-4 md:grid-cols-2 " + (className ?? "")}
    >
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className="w-full rounded-[10px] border px-5 py-4 text-left transition-all duration-150 cursor-pointer"
            style={{
              background:
                "linear-gradient(135deg, rgba(39,41,46,0.95) 0%, rgba(35,39,47,0.95) 100%)",
              borderColor: selected
                ? "var(--modringht-brand)"
                : "var(--modringht-border-soft)",
            }}
          >
            <span className="flex items-center justify-between gap-4">
              <span className="flex flex-col">
                <span className="text-xl leading-none font-medium font-inter text-(--modringht-text-primary)">
                  {option.label}
                </span>
                {option.description ? (
                  <span
                    className="mt-1 text-xs font-semibold tracking-wider uppercase font-inter"
                    style={{ color: "var(--modringht-text-muted)" }}
                  >
                    {option.description}
                  </span>
                ) : null}
              </span>

              <span
                aria-hidden
                className="shrink-0 rounded-full flex items-center justify-center"
                style={{
                  width: 24,
                  height: 24,
                  border: `1.5px solid ${
                    selected
                      ? "var(--modringht-brand)"
                      : "rgba(159, 164, 179, 0.55)"
                  }`,
                  backgroundColor: "#11151b",
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    backgroundColor: selected
                      ? "var(--modringht-brand)"
                      : "transparent",
                  }}
                />
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
