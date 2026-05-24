import { contextBridge, ipcRenderer } from "electron";
import { StorageType } from "./types/Storage.types";
import { GameStatusData } from "./types/window";

contextBridge.exposeInMainWorld("lyra", {
  getSettings: async () => {
    return await ipcRenderer.invoke("getSettings");
  },
  setSettings: async (settings: StorageType["settings"]) => {
    return await ipcRenderer.invoke("setSettings", settings);
  },
  startGame: async () => {
    return await ipcRenderer.invoke("startGame");
  },
  relaunche_app: async () => {
    return await ipcRenderer.invoke("relaunche_app");
  },
  send_error_log: async () => {
    return await ipcRenderer.invoke("send_error_log");
  },
  openLink: async (link: string) => {
    return await ipcRenderer.invoke("openLink", link);
  },
  isLoged: async () => {
    return await ipcRenderer.invoke("isLoged");
  },
  logout: async () => {
    return await ipcRenderer.invoke("logout");
  },
  getPlayerData: async () => {
    return await ipcRenderer.invoke("getPlayerData");
  },
  onGameStatus: (callback: (data: GameStatusData) => void) => {
    ipcRenderer.on("onGameStatus", (event, data: GameStatusData) => {
      callback(data);
    });
  },
  onErrorStatus: (callback: (data: { message: string }) => void) => {
    ipcRenderer.on(
      "onErrorStatus",
      (
        event,
        data: {
          message: string;
        },
      ) => {
        callback(data);
      },
    );
  },
  onRefreshRequest: (callback: () => void) => {
    ipcRenderer.on("onRefreshRequest", () => {
      callback();
    });
  },
});
