import React from 'react';
import { GestureType } from '../AvatarCanvas/gestureController.js';
import { ExpressionType } from '../AvatarCanvas/expressionController.js';
import styles from './GestureDock.module.css';

export interface GestureDockProps {
  onTriggerGesture: (gesture: GestureType, expression?: ExpressionType) => void;
}

export const GestureDock: React.FC<GestureDockProps> = ({ onTriggerGesture }) => {
  const gestures: Array<{ label: string; icon: string; type: GestureType; expr: ExpressionType }> = [
    { label: 'Wave', icon: '👋', type: 'wave', expr: 'smile' },
    { label: 'Thumbs Up', icon: '👍', type: 'thumbs_up', expr: 'smile' },
    { label: 'Clap', icon: '👏', type: 'clap', expr: 'laugh' },
    { label: 'Peace', icon: '✌️', type: 'peace_sign', expr: 'sarcastic_smirk' },
    { label: 'Point', icon: '👉', type: 'point', expr: 'surprise' }
  ];

  return (
    <div className={styles.dock}>
      {gestures.map((g) => (
        <button
          key={g.type}
          type="button"
          className={styles.gestureBtn}
          onClick={() => onTriggerGesture(g.type, g.expr)}
        >
          <span>{g.icon}</span>
          <span>{g.label}</span>
        </button>
      ))}
    </div>
  );
};
