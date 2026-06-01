import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  session,
  shell,
  Tray,
} from "electron";
import Store from "electron-store";
import path from "node:path";
import { StartGame } from "./lib/game";
import { getStorage } from "./lib/storage";
import fs from "fs/promises";

import { StorageType } from "./types/Storage.types";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

if (require("electron-squirrel-startup")) {
  app.quit();
}

const store: Store<StorageType> = getStorage();
let tempCrachPath: string;

import trayIconIcns from "./img/icon.icns";
import trayIconIco from "./img/icon.ico";
import trayIconPng from "./img/icon.png";

const trayIcon =
  process.platform === "darwin"
    ? trayIconIcns
    : process.platform === "win32"
      ? trayIconIco
      : trayIconPng;

const getLock = app.requestSingleInstanceLock();

if (!getLock) {
  app.quit();
  process.exit(0);
}

app.on("second-instance", (event, commandLine) => {
  if (mainWindow) {
    if (mainWindow.isDestroyed()) createWindow();
  }

  ipcMain.emit("deekLinkCall", null, commandLine.toString().split("//")[1]);
});

let isQuitting = false;

let mainWindow: BrowserWindow;

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient("lyra", process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  }
} else {
  app.setAsDefaultProtocolClient("lyra");
}

const createWindow = (): void => {
  mainWindow = new BrowserWindow({
    height: 652,
    width: 1140,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  ipcMain.on("openWindow", () => {
    if (mainWindow.isDestroyed()) {
      mainWindow.removeAllListeners();
      createWindow();
    }
  });

  ipcMain.on(
    "onGameStatus",
    (
      event,
      data: {
        type:
          | "download"
          | "check"
          | "patch"
          | "extract"
          | "start"
          | "start_end";
        message: string;
      },
    ) => {
      if (mainWindow.isDestroyed()) return;
      mainWindow.webContents.send("onGameStatus", data);
    },
  );

  ipcMain.on(
    "onErrorStatus",
    (event, data: { message: string; errorFile: string }) => {
      if (mainWindow.isDestroyed()) return;
      tempCrachPath = data.errorFile;
      mainWindow.webContents.send("onErrorStatus", data);
    },
  );

  ipcMain.on("deekLinkCall", async (event, call: string) => {
    const parcedCall = call.split("/");

    if (mainWindow.isDestroyed()) createWindow();

    if (parcedCall[0] === "login") {
      const currentSettings = store.get("settings");
      const cookie =
        "__Secure-__Secure-better-auth.session_token=" + parcedCall[1];

      try {
        const accountInfo = await fetch(
          "https://lyra.royaly.dev/api/auth/get-session",
          {
            method: "GET",
            headers: {
              Cookie: decodeURIComponent(cookie),
              Origin: "lyra:/",
            },
          },
        );

        const playerInfo = await fetch(
          "https://lyra.royaly.dev/api/player/get",
          {
            method: "GET",
            headers: {
              Cookie: decodeURIComponent(cookie),
              Origin: "lyra:/",
            },
          },
        );

        const parsedAccountInfo = await accountInfo.json();

        if (!parsedAccountInfo) {
          ipcMain.emit("onErrorStatus", null, { message: "error" });
          return;
        }

        const parsedPlayerInfo = await playerInfo.json();

        const newSettings: StorageType["settings"] = {
          ...currentSettings,
          account: {
            name: parsedPlayerInfo.data.name,
            token: parcedCall[1],
            uuid: parsedPlayerInfo.data.uuid,
          },
        };

        store.set("settings", newSettings);

        if (!mainWindow.isFocused()) mainWindow.focus();

        mainWindow.webContents.send("onRefreshRequest");
      } catch (e) {
        ipcMain.emit("onErrorStatus", null, { message: "Connect_error" });
      }
    }
  });

  ipcMain.on("reload", () => {
    mainWindow.webContents.send("onRefreshRequest");
  });

  mainWindow.on("close", (e) => {
    if (!isQuitting) {
      e.preventDefault();
      mainWindow.destroy();
    }
  });
};

app.on("ready", async () => {
  console.log(store.get("settings"));

  if (
    store.get("settings")?.startup &&
    !app.getLoginItemSettings().openAtLogin &&
    process.platform === "win32"
  ) {
    app.setLoginItemSettings({ openAtLogin: true });
  }

  createWindow();
  session.defaultSession.webRequest.onHeadersReceived((detail, callback) => {
    callback({
      responseHeaders: {
        ...detail.responseHeaders,
        "Access-Control-Allow-Origin": ["*"],
        "Access-Control-Allow-Methods": ["GET, OPTIONS"],
        "Content-Security-Policy": ["frame-src 'self' https:;"],
      },
    });
  });

  const appTray = new Tray(path.join(__dirname, trayIcon));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Start on startup",
      type: "checkbox",
      checked: app.getLoginItemSettings().openAtLogin,
      click: () => {
        if (app.getLoginItemSettings().openAtLogin) {
          app.setLoginItemSettings({ openAtLogin: false });
        } else {
          app.setLoginItemSettings({ openAtLogin: true });
        }
      },
    },
    {
      label: "Open",
      type: "normal",
      click: () => {
        if (mainWindow.isDestroyed()) {
          mainWindow.removeAllListeners();
          createWindow();
        }
      },
    },
    {
      label: "quit",
      type: "normal",
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);

  appTray.setToolTip("Lyra");
  appTray.setContextMenu(contextMenu);
});

app.on("window-all-closed", () => {
  console.log("do nothing");
});

ipcMain.handle("getSettings", async () => {
  return store.get("settings");
});

ipcMain.handle(
  "setSettings",
  async (event, settings: StorageType["settings"]) => {
    if (
      settings.startup !== app.getLoginItemSettings().openAtLogin &&
      process.platform === "win32"
    ) {
      app.setLoginItemSettings({ openAtLogin: settings.startup });
    }
    store.set("settings", settings);
    return true;
  },
);

ipcMain.handle("startGame", async () => {
  StartGame();
  return true;
});

ipcMain.handle("relaunche_app", async () => {
  isQuitting = true;
  app.relaunch();
  app.quit();
  return true;
});

ipcMain.handle("send_error_log", async () => {
  if (!tempCrachPath) return;

  const file = await fs.readFile(tempCrachPath);
  const settings: StorageType["settings"] = store.get("settings");
  const cookie =
    "__Secure-better-auth.session_token=" + settings?.account?.token;

  await fetch("https://lyra.royaly.dev/api/error", {
    method: "POST",
    headers: {
      Cookie: decodeURIComponent(cookie),
      Origin: "lyra:/",
    },
    body: file,
  });

  return true;
});

ipcMain.handle("openLink", (event, link: string) => {
  shell.openExternal(link);
});

ipcMain.handle("isLoged", async () => {
  const currentSettings = store.get("settings");

  // TODO : check if the player is not banned and if the current session is still alive

  const settings: StorageType["settings"] = store.get("settings");
  const cookie =
    "__Secure-better-auth.session_token=" + settings?.account?.token;

  const accountInfo = await fetch(
    "https://lyra.royaly.dev/api/auth/get-session",
    {
      method: "GET",
      headers: {
        Cookie: decodeURIComponent(cookie),
        Origin: "lyra:/",
      },
    },
  );

  const parsedAccountInfo = await accountInfo.json();

  if (!parsedAccountInfo) return false;

  if (parsedAccountInfo)
    if (currentSettings?.account?.token) {
      return true;
    } else {
      return false;
    }
});

ipcMain.handle("logout", () => {
  const { account, ...newSettings } = store.get("settings");
  store.set("settings", newSettings);
  ipcMain.emit("reload");
});

ipcMain.handle("getPlayerData", async () => {
  const settings: StorageType["settings"] = store.get("settings");
  const cookie =
    "__Secure-better-auth.session_token=" + settings?.account?.token;

  const playerData = await fetch("https://lyra.royaly.dev/api/player/get", {
    method: "GET",
    headers: {
      Cookie: decodeURIComponent(cookie),
      Origin: "lyra:/",
    },
  });

  const parsedPlayerData: {
    confirm: boolean;
    data: {
      uuid: string;
      name: string;
      type: number;
      skin?: string;
      job: string;
    };
  } = await playerData.json();

  if (!parsedPlayerData.confirm) return { confirm: false };

  store.set("settings", {
    ...settings,
    account: { ...settings.account, name: parsedPlayerData.data.name },
  });

  return parsedPlayerData;
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
