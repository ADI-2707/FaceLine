export interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

export class MemoryStorageAdapter implements StorageAdapter {
  private store = new Map<string, string>();

  public async getItem(key: string): Promise<string | null> {
    return this.store.get(key) || null;
  }

  public async setItem(key: string, value: string): Promise<void> {
    this.store.set(key, value);
  }

  public async removeItem(key: string): Promise<void> {
    this.store.delete(key);
  }
}

export class CryptoVault {
  private adapter: StorageAdapter;

  constructor(adapter?: StorageAdapter) {
    this.adapter = adapter || new MemoryStorageAdapter();
  }

  public async saveAccountPickle(userId: string, pickleStr: string): Promise<void> {
    await this.adapter.setItem(`faceline:account:${userId}`, pickleStr);
  }

  public async getAccountPickle(userId: string): Promise<string | null> {
    return await this.adapter.getItem(`faceline:account:${userId}`);
  }

  public async saveSessionPickle(sessionId: string, pickleStr: string): Promise<void> {
    await this.adapter.setItem(`faceline:session:${sessionId}`, pickleStr);
  }

  public async getSessionPickle(sessionId: string): Promise<string | null> {
    return await this.adapter.getItem(`faceline:session:${sessionId}`);
  }
}
