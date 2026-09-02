import Olm from '@matrix-org/olm';
import { OlmAccountManager } from './olm.js';

export interface EncryptedMessagePayload {
  type: number;
  body: string;
}

export class OlmSessionManager {
  private session: Olm.Session;

  constructor() {
    this.session = new Olm.Session();
  }

  public getSession(): Olm.Session {
    return this.session;
  }

  public createOutbound(
    accountManager: OlmAccountManager,
    recipientIdentityKey: string,
    recipientOneTimeKey: string
  ): void {
    this.session.create_outbound(
      accountManager.getAccount(),
      recipientIdentityKey,
      recipientOneTimeKey
    );
  }

  public createInbound(
    accountManager: OlmAccountManager,
    oneTimeKeyMsg: string
  ): void {
    this.session.create_inbound(accountManager.getAccount(), oneTimeKeyMsg);
    accountManager.getAccount().remove_one_time_keys(this.session);
  }

  public createInboundFrom(
    accountManager: OlmAccountManager,
    identityKey: string,
    oneTimeKeyMsg: string
  ): void {
    this.session.create_inbound_from(
      accountManager.getAccount(),
      identityKey,
      oneTimeKeyMsg
    );
    accountManager.getAccount().remove_one_time_keys(this.session);
  }

  public encrypt(plaintext: string): EncryptedMessagePayload {
    const encrypted = this.session.encrypt(plaintext);
    return {
      type: encrypted.type,
      body: encrypted.body
    };
  }

  public decrypt(type: number, ciphertext: string): string {
    return this.session.decrypt(type, ciphertext);
  }

  public pickle(password: string): string {
    return this.session.pickle(password);
  }

  public static unpickle(pickleStr: string, password: string): OlmSessionManager {
    const manager = new OlmSessionManager();
    manager.session.unpickle(password, pickleStr);
    return manager;
  }
}
