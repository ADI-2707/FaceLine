import React, { useState } from 'react';
import styles from './App.module.css';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>FaceLine</h1>
        <p className={styles.subtitle}>3D Avatar Chat — End-to-End Encrypted</p>
        <button className={styles.button} onClick={toggleTheme} data-testid="theme-toggle">
          Toggle Theme ({theme})
        </button>
      </div>
    </div>
  );
};
