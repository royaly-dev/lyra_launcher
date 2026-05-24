export type StorageType = {
  settings: {
    ram?: number;
    monitorResolutions?: string;
    downloadFiles?: number;
    startup?: boolean;
    account?: {
      uuid: string;
      name: string;
      token: string;
    };
  };
};
