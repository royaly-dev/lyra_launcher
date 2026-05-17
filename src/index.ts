import { app, BrowserWindow, ipcMain, Menu, session, Tray } from "electron";
import Store from "electron-store";
import path from "node:path";
import { StartGame } from "./lib/game";
import { getStorage } from "./lib/storage";

import { StorageType } from "./types/Storage.types";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

if (require("electron-squirrel-startup")) {
  app.quit();
}

const store: Store<StorageType> = getStorage();

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

app.on("second-instance", () => {
  if (mainWindow) {
    if (mainWindow.isDestroyed()) createWindow();
  }
});

let isQuitting = false;

let mainWindow: BrowserWindow;

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
        type: "download" | "check" | "patch" | "extract";
        message: string;
      },
    ) => {
      if (mainWindow.isDestroyed()) return;
      mainWindow.webContents.send("onGameStatus", data);
    },
  );

  ipcMain.on("onErrorStatus", (event, data: { message: string }) => {
    if (mainWindow.isDestroyed()) return;
    mainWindow.webContents.send("onErrorStatus", data);
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
  return true;
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
