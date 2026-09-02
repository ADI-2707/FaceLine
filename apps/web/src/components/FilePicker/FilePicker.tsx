import React, { useRef, useState } from 'react';
import { encryptMediaFile } from '@faceline/shared';
import styles from './FilePicker.module.css';

export interface FilePickerProps {
  onSendEncryptedFile: (descriptor: { fileName: string; aesKeyBase64: string; ivBase64: string }) => void;
  onClose: () => void;
}

export const FilePicker: React.FC<FilePickerProps> = ({ onSendEncryptedFile, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isEncrypting, setIsEncrypting] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleEncryptAndSend = async () => {
    if (!selectedFile) return;

    setIsEncrypting(true);
    setProgress(30);

    const buffer = await selectedFile.arrayBuffer();
    setProgress(60);

    const encrypted = await encryptMediaFile(buffer);
    setProgress(100);

    setTimeout(() => {
      onSendEncryptedFile({
        fileName: selectedFile.name,
        aesKeyBase64: encrypted.aesKeyBase64,
        ivBase64: encrypted.ivBase64
      });
      onClose();
    }, 400);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Send Encrypted Attachment</h2>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        <div className={styles.dropzone} onClick={() => fileInputRef.current?.click()}>
          {selectedFile ? (
            <>
              <span style={{ fontSize: '32px' }}>📄</span>
              <span className={styles.fileName}>{selectedFile.name}</span>
              <span className={styles.fileSize}>
                {(selectedFile.size / 1024).toFixed(1)} KB
              </span>
            </>
          ) : (
            <>
              <span style={{ fontSize: '36px' }}>🔒</span>
              <span className={styles.fileName}>Click to Select File</span>
              <span className={styles.fileSize}>Client-side WebCrypto AES-256-GCM Encryption</span>
            </>
          )}
        </div>

        {isEncrypting && (
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
        )}

        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className={styles.uploadBtn}
            disabled={!selectedFile || isEncrypting}
            onClick={handleEncryptAndSend}
          >
            {isEncrypting ? 'Encrypting...' : 'Encrypt & Send'}
          </button>
        </div>
      </div>
    </div>
  );
};
