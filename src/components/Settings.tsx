import { useState } from "react";
import ModringhtToggle from "./ModringhtToggle";
import VolumeSlider from "./VolumeSlider";

export default function Settings_section() {
  const [volume, setVolume] = useState<number>(0);
  const [modEnabled, setModEnabled] = useState<boolean>(true);

  return (
    <div style={{ padding: 24, background: "#1f232b", minHeight: "100vh" }}>
      <VolumeSlider
        value={volume}
        onChange={setVolume}
        min={0}
        max={100}
        step={1}
        snapPoints={[0, 25, 50, 75, 100]}
        snapRange={3}
        unit="%"
      />
      <div
        style={{
          marginTop: 20,
          display: "flex",
          alignItems: "center",
          gap: 12,
          color: "var(--modringht-text-default)",
          fontSize: "14px",
          fontWeight: 600,
        }}
      >
        <span>Activer le mod</span>
        <ModringhtToggle checked={modEnabled} onChange={setModEnabled} />
        <span style={{ color: "var(--modringht-text-muted)" }}>
          {modEnabled ? "Activé" : "Désactivé"}
        </span>
      </div>
    </div>
  );
}
