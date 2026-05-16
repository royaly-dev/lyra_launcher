import { app, BrowserWindow, Menu, session, Tray } from "electron";
import Store from "electron-store";
import path from "node:path";

import { StorageType } from "./types/Storage.types";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

if (require("electron-squirrel-startup")) {
  app.quit();
}

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

const store = new Store<StorageType>({
  defaults: {
    settings: {
      ram: 4096,
      startup: true,
    },
  },
});
let isQuitting = false;

if (
  store.get("settings").startup &&
  !app.getLoginItemSettings().openAtLogin &&
  process.platform === "win32"
) {
  app.setLoginItemSettings({ openAtLogin: true });
}

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

  mainWindow.on("close", (e) => {
    if (!isQuitting) {
      e.preventDefault();
      mainWindow.destroy();
    }
  });
};

app.on("ready", () => {
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
        if (mainWindow.isDestroyed()) createWindow();
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

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
