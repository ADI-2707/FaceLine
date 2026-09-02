import { StorageAdapter } from '@faceline/shared';

export class MobileSecureStorageAdapter implements StorageAdapter {
  private memoryStore = new Map<string, string>();

  public async getItem(key: string): Promise<string | null> {
    try {
      const SecureStore = await import('expo-secure-store');
      return await SecureStore.getItemAsync(key);
    } catch {
      return this.memoryStore.get(key) || null;
    }
  }

  public async setItem(key: string, value: string): Promise<void> {
    try {
      const SecureStore = await import('expo-secure-store');
      await SecureStore.setItemAsync(key, value);
    } catch {
      this.memoryStore.set(key, value);
    }
  }

  public async removeItem(key: string): Promise<void> {
    try {
      const SecureStore = await import('expo-secure-store');
      await SecureStore.deleteItemAsync(key);
    } catch {
      this.memoryStore.delete(key);
    }
  }
}
