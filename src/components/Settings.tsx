import { useState } from "react";
import AccountDisplay from "./AccountDisplay";
import ModringhtToggle from "./ModringhtToggle";
import RadioSelector from "./RadioSelector";
import VolumeSlider from "./VolumeSlider";

export default function Settings_section() {
  const [volume, setVolume] = useState<number>(0);
  const [modEnabled, setModEnabled] = useState<boolean>(true);
  const [resolution, setResolution] = useState<string>("1920x1080");
  const [filePerSecond, setFilePerSecond] = useState<number>(5);

  const resolutionOptions = [
    {
      value: "1280x720",
      label: "1280 x 720",
      description: "16:9 Aspect Ratio",
    },
    {
      value: "1920x1080",
      label: "1920 x 1080",
      description: "Standard Full HD",
    },
    {
      value: "2560x1440",
      label: "2560 x 1440",
      description: "Quad HD Graphics",
    },
    { value: "3840x2160", label: "3840 x 2160", description: "Ultra HD 4K" },
  ];

  return (
    <div
      className="p-6 h-[90%] w-[75%] overflow-y-auto"
      style={{ scrollbarWidth: "none" }}
    >
      <AccountDisplay
        name="test player"
        url="https://upload.royaly.dev/data/cat.jpg"
        mainClassName="pb-4"
      />

      <div className="py-4 flex items-center gap-3 text-(--modringht-text-default) text-sm font-semibold">
        <span className="text-base">
          Démarrer le launcher au démarrage de l'ordinateur:
        </span>
        <ModringhtToggle checked={modEnabled} onChange={setModEnabled} />
        <span style={{ color: "var(--modringht-text-muted)" }}>
          {modEnabled ? "Activé" : "Désactivé"}
        </span>
      </div>

      <div className="py-4 flex items-center gap-1.5 text-(--modringht-text-default) text-sm font-semibold">
        <span className="text-base">
          Nombre de fichier à télécharger simultanement :
        </span>
        <input
          className="w-12 h-9 px-2.5 text-base outline-none color-[#e9edf4] bg-[#20252e] border border-solid border-[#4d596b] rounded-lg"
          type="number"
          value={filePerSecond}
          min={1}
          max={10}
          step={1}
          onChange={(event) => setFilePerSecond(Number(event.target.value))}
        />
        <span className="text-(--modringht-text-muted)">Fichier / seconde</span>
      </div>

      <div className="flex flex-col gap-4 py-3">
        <h1 className="text-2xl! text-(--modringht-text-default) font-[Inter]">
          Résolution d'écran :
        </h1>
        <RadioSelector
          name="resolution"
          options={resolutionOptions}
          value={resolution}
          onChange={setResolution}
        />
      </div>

      <div className="flex flex-col gap-4 py-4">
        <h1 className="text-2xl! text-(--modringht-text-default) font-[Inter]">
          Gestion de la RAM :
        </h1>
        <p className="text-base! text-(--modringht-text-default) font-[Inter]">
          Ici tu peut régler la ram que minecraft vas pouvoir prendre, il est
          recommander dans mettre au moins 6G le minimum est 4G.
        </p>

        <VolumeSlider
          value={volume}
          onChange={setVolume}
          min={512}
          max={16384}
          step={1}
          snapPoints={[0, 4096, 8192, 16384]}
          snapRange={512}
          unit="Mb"
        />
      </div>
    </div>
  );
}
