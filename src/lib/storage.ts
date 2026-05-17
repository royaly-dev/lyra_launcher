import { StorageType } from "@/types/Storage.types";
import Store from "electron-store";

const storage: Store<StorageType> = new Store<StorageType>({
  defaults: {
    settings: {
      ram: 4096,
      startup: true,
      downloadFiles: 5,
      monitorResolutions: "1920x1080",
    },
  },
});

export function getStorage() {
  return storage;
}
