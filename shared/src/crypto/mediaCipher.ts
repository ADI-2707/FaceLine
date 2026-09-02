export interface EncryptedMediaDescriptor {
  ciphertextBuffer: ArrayBuffer;
  aesKeyBase64: string;
  ivBase64: string;
  sha256Base64: string;
}

function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export async function encryptMediaFile(fileBuffer: ArrayBuffer): Promise<EncryptedMediaDescriptor> {
  const cryptoObj = typeof globalThis.crypto !== 'undefined' ? globalThis.crypto : (await import('crypto')).webcrypto;
  
  const aesKey = await cryptoObj.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  const iv = new Uint8Array(12);
  if (typeof cryptoObj.getRandomValues === 'function') {
    (cryptoObj as Crypto).getRandomValues(iv);
  } else {
    const nodeCrypto = await import('crypto');
    nodeCrypto.randomFillSync(iv);
  }

  const ciphertextBuffer = await cryptoObj.subtle.encrypt(
    { name: 'AES-GCM', iv },
    aesKey,
    fileBuffer
  );

  const exportedKey = await cryptoObj.subtle.exportKey('raw', aesKey);
  const sha256Buffer = await cryptoObj.subtle.digest('SHA-256', fileBuffer);

  return {
    ciphertextBuffer,
    aesKeyBase64: bufferToBase64(exportedKey),
    ivBase64: bufferToBase64(iv.buffer),
    sha256Base64: bufferToBase64(sha256Buffer)
  };
}

export async function decryptMediaFile(
  ciphertextBuffer: ArrayBuffer,
  aesKeyBase64: string,
  ivBase64: string
): Promise<ArrayBuffer> {
  const cryptoObj = typeof globalThis.crypto !== 'undefined' ? globalThis.crypto : (await import('crypto')).webcrypto;

  const keyBuffer = base64ToBuffer(aesKeyBase64);
  const ivBuffer = base64ToBuffer(ivBase64);

  const aesKey = await cryptoObj.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );

  return await cryptoObj.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array(ivBuffer) },
    aesKey,
    ciphertextBuffer
  );
}
