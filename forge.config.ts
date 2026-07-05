import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
import { MakerDeb } from "@electron-forge/maker-deb";
import { AutoUnpackNativesPlugin } from "@electron-forge/plugin-auto-unpack-natives";
import { WebpackPlugin } from "@electron-forge/plugin-webpack";
import { FusesPlugin } from "@electron-forge/plugin-fuses";
import { FuseV1Options, FuseVersion } from "@electron/fuses";

import { mainConfig } from "./webpack.main.config";
import { rendererConfig } from "./webpack.renderer.config";
import fs from "fs";
import path from "path";

const config: ForgeConfig = {
  packagerConfig: {
    name: "lyra_launcher",
    asar: true,
    icon: "src/img/icon",
    protocols: [
      {
        name: "Lyra",
        schemes: ["lyra"],
      },
    ],
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      authors: "royaly",
      title: "Lyra Launcher",
      name: "Lyra Launcher",
      setupIcon: "src/img/icon.ico",
      iconUrl: "https://lyra.royaly.dev/favicon.ico",
    }),
    new MakerZIP({}, ["darwin"]),
    new MakerDeb({
      options: {
        maintainer: "royaly-dev",
        mimeType: ["x-scheme-handler/lyra"],
        categories: ["Game"],
        desktopTemplate: undefined,
        icon: "src/img/icon.png",
      },
    }),
  ],
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "royaly-dev",
          name: "lyra_launcher",
        },
        draft: false,
        prerelease: false,
      },
    },
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: "./src/index.html",
            js: "./src/renderer.tsx",
            name: "main_window",
            preload: {
              js: "./src/preload.ts",
            },
          },
        ],
      },
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
