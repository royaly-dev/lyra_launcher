import { useEffect, useState } from "react";

type VolumeSliderProps = {
  value?: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  forceStep?: boolean;
  snapPoints?: number[];
  snapRange?: number;
  disabled?: boolean;
  unit?: string;
  className?: string;
};

export default function VolumeSlider({
  value = 0,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  forceStep = false,
  snapPoints = [],
  snapRange = 6,
  disabled = false,
  unit = "",
  className,
}: VolumeSliderProps) {
  const [currentValue, setCurrentValue] = useState(Math.max(min, value));
  const range = Math.max(1, max - min);

  useEffect(() => {
    setCurrentValue(Math.max(min, value));
  }, [min, value]);

  const inputValueValid = (inputValue: number) => {
    let newValue = Number.isNaN(inputValue) ? min : inputValue;
    if (forceStep) {
      newValue -= newValue % step;
    }
    newValue = Math.max(min, Math.min(newValue, max));
    setCurrentValue(newValue);
    onChange(newValue);
  };

  const onInputWithSnap = (nextValue: string) => {
    let parsedValue = parseInt(nextValue, 10);
    if (Number.isNaN(parsedValue)) {
      parsedValue = min;
    }

    for (const snapPoint of snapPoints) {
      const distance = Math.abs(snapPoint - parsedValue);
      if (distance < snapRange) {
        parsedValue = snapPoint;
      }
    }

    inputValueValid(parsedValue);
  };

  const onNumberInput = (nextValue: string) => {
    const parsedValue = parseInt(nextValue, 10);
    const newValue = Number.isNaN(parsedValue)
      ? min
      : Math.max(min, Math.min(parsedValue, max));
    setCurrentValue(newValue);
    onChange(newValue);
  };

  return (
    <div
      className={className}
      style={{ display: "flex", alignItems: "center", width: "100%" }}
    >
      <div style={{ width: "100%", position: "relative" }}>
        <div style={{ position: "relative", height: "1.2rem", display: "flex", alignItems: "center" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "calc(100% - 0.95rem)",
                height: "100%",
                left: "calc(0.95rem / 2)",
              }}
            >
              {snapPoints.map((snapPoint) => (
                <div
                  key={snapPoint}
                  style={{
                    position: "absolute",
                    width: "0.32rem",
                    height: "0.95rem",
                    borderRadius: "0.2rem",
                    transform: "translate(-50%, -50%)",
                    opacity: disabled ? 0 : 1,
                    left: `${((snapPoint - min) / range) * 100}%`,
                    top: "50%",
                    backgroundColor: snapPoint <= currentValue ? "#1bd96a" : "#5f6b7c",
                  }}
                />
              ))}
            </div>
          </div>

          <input
            type="range"
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            value={currentValue}
            onInput={(event) => onInputWithSnap((event.target as HTMLInputElement).value)}
            className="lyra-modrinth-slider"
            style={
              {
                "--current-value": String(currentValue),
                "--min-value": String(min),
                "--max-value": String(max),
              } as Record<string, string>
            }
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            fontSize: "0.75rem",
            margin: 0,
            color: "#d1d7e2",
          }}
        >
          <span>
            {min} {unit}
          </span>
          <span>
            {max} {unit}
          </span>
        </div>
      </div>

      <input
        type="number"
        value={currentValue}
        disabled={disabled}
        min={min}
        max={max}
        step={1}
        onChange={(event) => onNumberInput(event.target.value)}
        style={{
          width: "6rem",
          marginLeft: "0.75rem",
          height: "2.25rem",
          borderRadius: "0.5rem",
          border: "1px solid #4d596b",
          backgroundColor: "#20252e",
          color: "#e9edf4",
          padding: "0 0.625rem",
          fontSize: "0.95rem",
          outline: "none",
        }}
      />

      <style>
        {`
          .lyra-modrinth-slider {
            -webkit-appearance: none;
            appearance: none;
            position: relative;
            border-radius: 999px;
            height: 0.48rem;
            width: 100%;
            padding: 0;
            margin: 0;
            min-height: 0;
            outline: none;
            border: none;
            background:
              linear-gradient(
                to right,
                #1bd96a 0%,
                #1bd96a calc((var(--current-value) - var(--min-value)) / (var(--max-value) - var(--min-value)) * 100%),
                #4d5868 calc((var(--current-value) - var(--min-value)) / (var(--max-value) - var(--min-value)) * 100%),
                #4d5868 100%
              ) 100% 100% no-repeat;
            box-shadow: inset 0 0 0 1px rgba(197, 209, 224, 0.12), 0 0 12px rgba(0, 0, 0, 0.22);
          }

          .lyra-modrinth-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 0.95rem;
            height: 0.95rem;
            background: radial-gradient(circle at 30% 30%, #7affb2 0%, #2ce578 55%, #1ab85d 100%);
            border: 1px solid #2f9f5b;
            border-radius: 50%;
            box-shadow: 0 0 0 3px rgba(27, 217, 106, 0.18), 0 2px 8px rgba(0, 0, 0, 0.35);
            transition: width 0.2s, height 0.2s;
          }

          .lyra-modrinth-slider::-moz-range-thumb {
            border: 1px solid #2f9f5b;
            width: 0.95rem;
            height: 0.95rem;
            background: radial-gradient(circle at 30% 30%, #7affb2 0%, #2ce578 55%, #1ab85d 100%);
            border-radius: 50%;
            box-shadow: 0 0 0 3px rgba(27, 217, 106, 0.18), 0 2px 8px rgba(0, 0, 0, 0.35);
            transition: width 0.2s, height 0.2s;
          }

          .lyra-modrinth-slider:hover:not(:disabled)::-webkit-slider-thumb,
          .lyra-modrinth-slider:hover:not(:disabled)::-moz-range-thumb {
            width: 1.15rem;
            height: 1.15rem;
          }

          .lyra-modrinth-slider:disabled {
            pointer-events: none;
            opacity: 0.5;
          }
        `}
      </style>
    </div>
  );
}
