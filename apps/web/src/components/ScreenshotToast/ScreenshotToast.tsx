import React, { useEffect } from 'react';
import styles from './ScreenshotToast.module.css';

export interface ScreenshotToastProps {
  takenByName: string;
  onClose: () => void;
}

export const ScreenshotToast: React.FC<ScreenshotToastProps> = ({ takenByName, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={styles.toast}>
      <span>📸</span>
      <span>{takenByName} took a screenshot!</span>
    </div>
  );
};
