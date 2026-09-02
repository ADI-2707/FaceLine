import Olm from '@matrix-org/olm';

export class MegolmOutboundSession {
  private session: Olm.OutboundGroupSession;

  constructor() {
    this.session = new Olm.OutboundGroupSession();
    this.session.create();
  }

  public getSessionKey(): string {
    return this.session.session_key();
  }

  public getSessionId(): string {
    return this.session.session_id();
  }

  public encrypt(plaintext: string): string {
    return this.session.encrypt(plaintext);
  }

  public pickle(password: string): string {
    return this.session.pickle(password);
  }

  public static unpickle(pickleStr: string, password: string): MegolmOutboundSession {
    const manager = new MegolmOutboundSession();
    manager.session.unpickle(password, pickleStr);
    return manager;
  }
}

export class MegolmInboundSession {
  private session: Olm.InboundGroupSession;

  constructor(sessionKey?: string) {
    this.session = new Olm.InboundGroupSession();
    if (sessionKey) {
      this.session.create(sessionKey);
    }
  }

  public getSessionId(): string {
    return this.session.session_id();
  }

  public decrypt(ciphertext: string): { plaintext: string; messageIndex: number } {
    const result = this.session.decrypt(ciphertext);
    return {
      plaintext: result.plaintext,
      messageIndex: result.message_index
    };
  }

  public pickle(password: string): string {
    return this.session.pickle(password);
  }

  public static unpickle(pickleStr: string, password: string): MegolmInboundSession {
    const manager = new MegolmInboundSession();
    manager.session.unpickle(password, pickleStr);
    return manager;
  }
}
