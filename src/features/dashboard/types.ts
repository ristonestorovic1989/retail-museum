export enum AssetType {
  Video = 'video',
  Image = 'image',
  Document = 'document',
  Audio = 'audio',
}

export const ASSET_TYPE_LABELS: Record<AssetType, string> = {
  [AssetType.Video]: 'Videos',
  [AssetType.Image]: 'Images',
  [AssetType.Document]: 'Documents',
  [AssetType.Audio]: 'Audio',
};

export const ASSET_TYPE_ORDER: AssetType[] = [
  AssetType.Video,
  AssetType.Image,
  AssetType.Document,
  AssetType.Audio,
];

export interface DashboardDeviceDto {
  id: number;
  name: string;
  deviceTypeName: string;
  os: string;
  active: boolean;
  registrationDate: string;
  registrationDateFormatted: string;
}

export interface DashboardSummaryDto {
  devicesSum: number;

  numberOfOnlineDevices: number;
  numberOnlineDevicesPercentage: number;
  numberOfOfflineDevices: number;
  numberOfflineDevicesPercentage: number;

  numberOfUpdatedDevices: number;
  numberOfNotUpdatedDevices: number;
  numberOfUpdatedDevicesPercentage: number;
  numberOfNotUpdatedDevicesPercentage: number;

  activeDevices: number;

  assetSum: number;
  publishedAssets: number;
  archivedAssets: number;

  jpgAssets: number;
  pngAssets: number;
  gifAssets: number;
  videoAssets: number;

  devices: DashboardDeviceDto[];

  companyStorage: number;
  occupiedMemory: number;
  storageQuota: number;
}

export interface DashboardSummaryResponse {
  succeeded: boolean;
  message: string;
  data: DashboardSummaryDto;
}
