export interface User {
  id: string;
  name: string;
  email: string;
  avatarGlbUrl?: string;
  avatarThumbnailUrl?: string;
  createdAt: string;
}

export interface DeviceKeys {
  id: string;
  userId: string;
  deviceId: string;
  identityKeyCurve25519: string;
  identityKeyEd25519: string;
  createdAt: string;
}

export interface PreKeyBundle {
  userId: string;
  deviceId: string;
  identityKeyCurve25519: string;
  identityKeyEd25519: string;
  keyId: number;
  oneTimeKey: string;
}
