import { FC, ReactNode, useEffect } from 'react';
import { useAutoBackup } from './useAutoBackup';
import { initBackupUtils } from './exposeBackupUtils';

interface AutoBackupProviderProps {
  children: ReactNode;
}

export const AutoBackupProvider: FC<AutoBackupProviderProps> = ({ children }) => {
  // Initialize auto-backup with full hook return
  const autoBackup = useAutoBackup();
  
  // Log backup activity for debugging
  useEffect(() => {
    console.log('AutoBackupProvider initialized');
    console.log('Auto-backup settings:', autoBackup.settings);
    
    // Don't force initial backup here - let useAutoBackup handle this
    // to prevent duplicate backups
    
    // Add event listener to track storage changes
    const handleStorageChange = () => {
      console.log('Storage changed, checking for auto-backup changes');
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Initialize the backup testing utilities for browser console
    initBackupUtils();
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Empty dependency array - only run once on mount
  
  return <>{children}</>;
}; 