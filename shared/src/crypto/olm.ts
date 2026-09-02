import Olm from '@matrix-org/olm';

export async function initOlm(): Promise<void> {
  await Olm.init();
}

export interface OlmAccountKeys {
  identityKeyCurve25519: string;
  identityKeyEd25519: string;
}

export interface SignedOneTimeKey {
  keyId: number;
  publicKey: string;
  signature: string;
}

export class OlmAccountManager {
  private account: Olm.Account;

  constructor() {
    this.account = new Olm.Account();
    this.account.create();
  }

  public getAccount(): Olm.Account {
    return this.account;
  }

  public getIdentityKeys(): OlmAccountKeys {
    const keysJson = JSON.parse(this.account.identity_keys());
    return {
      identityKeyCurve25519: keysJson.curve25519,
      identityKeyEd25519: keysJson.ed25519
    };
  }

  public generateOneTimeKeys(count: number = 20): SignedOneTimeKey[] {
    this.account.generate_one_time_keys(count);
    const otkJson = JSON.parse(this.account.one_time_keys());
    const curveKeys: { [key: string]: string } = otkJson.curve25519 || {};
    
    const signedKeys: SignedOneTimeKey[] = [];
    let keyIdCounter = 1;

    for (const [keyIdStr, publicKey] of Object.entries(curveKeys)) {
      const keyId = parseInt(keyIdStr, 10) || keyIdCounter++;
      const signature = this.account.sign(publicKey);
      signedKeys.push({
        keyId,
        publicKey,
        signature
      });
    }

    this.account.mark_keys_as_published();
    return signedKeys;
  }

  public pickle(password: string): string {
    return this.account.pickle(password);
  }

  public static unpickle(pickleStr: string, password: string): OlmAccountManager {
    const manager = new OlmAccountManager();
    manager.account.unpickle(password, pickleStr);
    return manager;
  }
}
