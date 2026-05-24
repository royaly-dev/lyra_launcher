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
  openLink: (link: string) => Promise<void>;
  isLoged: () => Promise<boolean>;
  logout: () => Promise<void>;
  getPlayerData: () => Promise<{
    confirm: boolean;
    data: {
      uuid: string;
      name: string;
      type: number;
      skin?: string;
      job: string;
    };
  }>;
  onGameStatus: (callback: (data: GameStatusData) => void) => void;
  onErrorStatus: (callback: (data: ErrorStatusData) => void) => void;
  onRefreshRequest: (callback: () => void) => void;
};

declare global {
  interface Window {
    lyra: LyraBridge;
  }
}
