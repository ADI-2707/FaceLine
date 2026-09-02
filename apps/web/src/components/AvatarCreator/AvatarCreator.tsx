import React, { useState } from 'react';
import { AvatarCanvas } from '../AvatarCanvas/AvatarCanvas.js';
import { DEFAULT_AVATAR_GLB_URL } from '../../utils/avatarLoader.js';
import styles from './AvatarCreator.module.css';

export interface AvatarCreatorProps {
  currentGlbUrl?: string;
  onSave: (url: string) => void;
  onClose: () => void;
}

export const AvatarCreator: React.FC<AvatarCreatorProps> = ({
  currentGlbUrl = DEFAULT_AVATAR_GLB_URL,
  onSave,
  onClose
}) => {
  const [glbUrl, setGlbUrl] = useState<string>(currentGlbUrl);
  const [previewUrl, setPreviewUrl] = useState<string>(currentGlbUrl);

  const handleApplyPreview = () => {
    setPreviewUrl(glbUrl);
  };

  const handleSave = () => {
    onSave(glbUrl);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Customize 3D Avatar</h2>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.previewContainer}>
          <AvatarCanvas avatarGlbUrl={previewUrl} expression="smile" />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Avaturn / ReadyPlayerMe GLB Model URL</label>
          <input
            type="text"
            className={styles.input}
            placeholder="https://models.readyplayer.me/..."
            value={glbUrl}
            onChange={(e) => setGlbUrl(e.target.value)}
          />
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={handleApplyPreview}>
            Preview Model
          </button>
          <button type="button" className={styles.saveBtn} onClick={handleSave}>
            Save Avatar Profile
          </button>
        </div>
      </div>
    </div>
  );
};
