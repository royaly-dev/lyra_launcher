import { app, BrowserWindow, session } from "electron";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

app.commandLine.appendSwitch("use-gl", "swiftshader");
app.commandLine.appendSwitch("ignore-gpu-blocklist");
app.commandLine.appendSwitch(
  "disable-features",
  "VideoOverlayOnFullscreenAllowed",
);

app.commandLine.appendSwitch("use-angle", "swiftshader"); // force ANGLE à utiliser SwiftShader
app.commandLine.appendSwitch("disable-gpu-driver-bug-workarounds");

if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    height: 652,
    width: 1140,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
};

app.on("ready", () => {
  createWindow();
  session.defaultSession.webRequest.onHeadersReceived((detail, callback) => {
    callback({
      responseHeaders: {
        ...detail.responseHeaders,
        "Content-Security-Policy": ["frame-src 'self' https:;"],
      },
    });
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
