import { describe, it, expect, beforeAll } from 'vitest';
import {
  initOlm,
  OlmAccountManager,
  OlmSessionManager,
  MegolmOutboundSession,
  MegolmInboundSession,
  encryptMediaFile,
  decryptMediaFile,
  CryptoVault
} from '../index.js';

describe('Shared Cryptography Engine', () => {
  beforeAll(async () => {
    await initOlm();
  });

  it('should initialize OlmAccountManager and generate signed prekeys', () => {
    const aliceAccount = new OlmAccountManager();
    const aliceKeys = aliceAccount.getIdentityKeys();

    expect(aliceKeys.identityKeyCurve25519).toBeDefined();
    expect(aliceKeys.identityKeyEd25519).toBeDefined();

    const prekeys = aliceAccount.generateOneTimeKeys(5);
    expect(prekeys.length).toBeGreaterThan(0);
    expect(prekeys[0].publicKey).toBeDefined();
    expect(prekeys[0].signature).toBeDefined();
  });

  it('should establish 1:1 X3DH session and encrypt/decrypt messages', () => {
    const aliceAccount = new OlmAccountManager();
    const bobAccount = new OlmAccountManager();

    const bobKeys = bobAccount.getIdentityKeys();
    const bobPrekeys = bobAccount.generateOneTimeKeys(1);

    const aliceSession = new OlmSessionManager();
    aliceSession.createOutbound(
      aliceAccount,
      bobKeys.identityKeyCurve25519,
      bobPrekeys[0].publicKey
    );

    const encrypted = aliceSession.encrypt('Hello Bob!');
    expect(encrypted.type).toBe(0);

    const bobSession = new OlmSessionManager();
    bobSession.createInbound(bobAccount, encrypted.body);

    const decrypted = bobSession.decrypt(encrypted.type, encrypted.body);
    expect(decrypted).toBe('Hello Bob!');
  });

  it('should encrypt and decrypt group messages using Megolm ratchet', () => {
    const outboundGroup = new MegolmOutboundSession();
    const sessionKey = outboundGroup.getSessionKey();

    const encryptedGroupMsg = outboundGroup.encrypt('Group secret meeting at 9PM');
    expect(encryptedGroupMsg).toBeDefined();

    const inboundGroup = new MegolmInboundSession(sessionKey);
    const decrypted = inboundGroup.decrypt(encryptedGroupMsg);

    expect(decrypted.plaintext).toBe('Group secret meeting at 9PM');
    expect(decrypted.messageIndex).toBe(0);
  });

  it('should encrypt and decrypt binary media files using WebCrypto AES-256-GCM', async () => {
    const textEncoder = new TextEncoder();
    const fileData = textEncoder.encode('Image binary content simulation').buffer;

    const encryptedMedia = await encryptMediaFile(fileData);
    expect(encryptedMedia.ciphertextBuffer).toBeDefined();
    expect(encryptedMedia.aesKeyBase64).toBeDefined();

    const decryptedBuffer = await decryptMediaFile(
      encryptedMedia.ciphertextBuffer,
      encryptedMedia.aesKeyBase64,
      encryptedMedia.ivBase64
    );

    const textDecoder = new TextDecoder();
    const decryptedText = textDecoder.decode(decryptedBuffer);
    expect(decryptedText).toBe('Image binary content simulation');
  });

  it('should store and retrieve account pickles in CryptoVault', async () => {
    const vault = new CryptoVault();
    await vault.saveAccountPickle('user_123', 'pickle_data_string');

    const retrieved = await vault.getAccountPickle('user_123');
    expect(retrieved).toBe('pickle_data_string');
  });
});
