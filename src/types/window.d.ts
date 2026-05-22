import { StorageType } from "./Storage.types";

export type GameStatusData = {
  type: "download" | "check" | "patch" | "extract" | "start" | "start_end";
  element: string;
  status: string;
};

export type ErrorStatusData = {
  message: "Connect_error" | "Game_error";
};

type LyraBridge = {
  getSettings: () => Promise<StorageType["settings"]>;
  setSettings: (settings: StorageType["settings"]) => Promise<boolean>;
  startGame: () => Promise<void>;
  relaunche_app: () => Promise<void>;
  send_error_log: () => Promise<void>;
  onGameStatus: (callback: (data: GameStatusData) => void) => void;
  onErrorStatus: (callback: (data: ErrorStatusData) => void) => void;
};

declare global {
  interface Window {
    lyra: LyraBridge;
  }
}
