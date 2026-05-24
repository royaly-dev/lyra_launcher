import { StorageType } from "@/types/Storage.types";
import { Launch } from "minecraft-java-core";
import { getStorage } from "./storage";
import { ipcMain } from "electron";

export async function StartGame() {
  let isDownloadCraching = 0;

  const settings: StorageType["settings"] = getStorage().get("settings");
  const appdata =
    process.platform === "win32"
      ? process.env.APPDATA + "\\"
      : process.env.HOME + "/";

  const auth = {
    access_token: settings.account.uuid,
    client_token: settings.account.uuid,
    uuid: settings.account.uuid,
    name: settings.account.name,
    user_properties: "{}",
    meta: {
      online: false,
      type: "AZauth",
    },
    ID: 1,
  };

  const game = new Launch();

  game.Launch({
    url: "http://localhost:3001/api/file",
    authenticator: auth,
    path: appdata + ".lyra",
    instance: "lyra",
    version: "1.20.1",
    detached: false,
    downloadFileMultiple: settings.downloadFiles,
    loader: {
      enable: true,
      type: "fabric",
      build: "latest",
    },
    screen: {
      width: Number(settings.monitorResolutions.split("x")[0]),
      height: Number(settings.monitorResolutions.split("x")[1]),
    },
    memory: {
      min: "2048M",
      max: settings.ram + "M",
    },
  });

  game.on("extract", (extract) => {
    console.log(extract);
    ipcMain.emit("onGameStatus", null, {
      type: "extract",
      element: `${extract}`,
      status: "",
    });
  });

  game.on("progress", (progress, size, element) => {
    console.log(
      `Downloading ${element} ${Math.round((progress / size) * 100)}%`,
    );
    ipcMain.emit("onGameStatus", null, {
      type: "download",
      element: element,
      status: Math.round((progress / size) * 100),
    });
  });

  game.on("check", (progress, size, element) => {
    console.log(`Checking ${element} ${Math.round((progress / size) * 100)}%`);
    ipcMain.emit("onGameStatus", null, {
      type: "check",
      element: element,
      status: Math.round((progress / size) * 100),
    });
  });

  game.on("estimated", (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time - hours * 3600) / 60);
    const seconds = Math.floor(time - hours * 3600 - minutes * 60);
    console.log(`${hours}h ${minutes}m ${seconds}s`);
  });

  game.on("speed", (speed) => {
    const calc = (speed / 1067008).toFixed(2);

    if (isDownloadCraching > 10) {
      ipcMain.emit("onErrorStatus", null, { message: "Connect_error" });
    }

    if (Number(calc) === 0) {
      isDownloadCraching += 1;
    }

    console.log(`${calc} Mb/s`);
  });

  game.on("patch", (patch) => {
    console.log(patch);
    ipcMain.emit("onGameStatus", null, {
      type: "patch",
      element: `${patch}`,
      status: "",
    });
  });

  game.on("data", (e: string) => {
    console.log(e);
    if (e.includes("#@!@# Game crashed! Crash report saved to: #@!@#")) {
      const crachFilePath = e.slice(49, e.length - 1);
      ipcMain.emit("openWindow");
      setTimeout(() => {
        ipcMain.emit("onErrorStatus", null, {
          message: "Game_error",
          errorFile: crachFilePath,
        });
      }, 500);
    } else if (e.includes("LyraClientInitFinsh")) {
      ipcMain.emit("onGameStatus", null, {
        type: "start_end",
        element: "",
        status: "",
      });
    } else {
      ipcMain.emit("onGameStatus", null, {
        type: "start",
        element: "",
        status: "",
      });
    }
  });

  game.on("close", (code) => {
    console.log(code);
    ipcMain.emit("openWindow");
  });

  game.on("error", (error) => {
    console.log("error : " + error);
  });
}
