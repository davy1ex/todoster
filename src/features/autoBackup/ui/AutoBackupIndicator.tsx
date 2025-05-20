import { FC, useState, useEffect } from 'react';
import { useAutoBackup } from '../model/useAutoBackup';
import './AutoBackupIndicator.css';

export const AutoBackupIndicator: FC = () => {
  const { settings } = useAutoBackup();
  const [showIndicator, setShowIndicator] = useState(false);
  const [backupTime, setBackupTime] = useState<string | null>(null);
  
  // Track localStorage changes to detect backups
  useEffect(() => {
    const handleStorageChange = () => {
      console.log('Storage change detected in indicator component');
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Show indicator when a backup happens
  useEffect(() => {
    if (settings.lastBackupTime) {
      const now = Date.now();
      const lastBackupTime = settings.lastBackupTime;
      
      // Only show indicator if backup happened in the last 5 seconds
      if (now - lastBackupTime < 5000) {
        console.log('Recent backup detected, showing indicator');
        setBackupTime(new Date(lastBackupTime).toLocaleTimeString());
        setShowIndicator(true);
        
        // Hide indicator after 5 seconds
        const timer = setTimeout(() => {
          console.log('Hiding backup indicator');
          setShowIndicator(false);
        }, 5000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [settings.lastBackupTime]);
  
  // Log mount/unmount for debugging
  useEffect(() => {
    console.log('AutoBackupIndicator mounted');
    return () => {
      console.log('AutoBackupIndicator unmounted');
    };
  }, []);
  
  if (!settings.enabled || !showIndicator) {
    return null;
  }
  
  return (
    <div className="auto-backup-indicator">
      <div className="auto-backup-indicator__icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="currentColor" />
        </svg>
      </div>
      <div className="auto-backup-indicator__content">
        <span className="auto-backup-indicator__text">Auto-backup complete</span>
        {backupTime && (
          <span className="auto-backup-indicator__time">{backupTime}</span>
        )}
      </div>
    </div>
  );
}; 