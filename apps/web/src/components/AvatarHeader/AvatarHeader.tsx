import React from 'react';
import { AvatarCanvas } from '../AvatarCanvas/AvatarCanvas.js';
import { ExpressionType } from '../AvatarCanvas/expressionController.js';
import { GestureType } from '../AvatarCanvas/gestureController.js';
import styles from './AvatarHeader.module.css';

export interface AvatarHeaderProps {
  peerName: string;
  peerGlbUrl?: string;
  peerExpression?: ExpressionType;
  peerGesture?: GestureType;
  isOnline?: boolean;
}

export const AvatarHeader: React.FC<AvatarHeaderProps> = ({
  peerName,
  peerGlbUrl,
  peerExpression = 'neutral',
  peerGesture,
  isOnline = true
}) => {
  return (
    <div className={styles.header}>
      <div className={styles.leftInfo}>
        <div className={styles.avatarViewport}>
          <AvatarCanvas
            avatarGlbUrl={peerGlbUrl}
            expression={peerExpression}
            gesture={peerGesture}
          />
        </div>
        <div className={styles.titleArea}>
          <div className={styles.title}>{peerName}</div>
          <div className={styles.subtitle}>
            {isOnline ? '● Active 3D Avatar' : '○ Offline'}
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.actionBtn} title="Start Voice Call">
          📞
        </button>
        <button type="button" className={styles.actionBtn} title="Start 3D Video Stream">
          📹
        </button>
      </div>
    </div>
  );
};
