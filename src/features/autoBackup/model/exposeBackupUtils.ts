import { triggerManualBackup, checkBackupHistory, verifyBackupSettings, setTestBackupInterval } from './backupTester';

// This module exposes the backup utilities to the global window object
// for easier testing in the browser console

declare global {
  interface Window {
    gamifiedTodoUtils: {
      backups: {
        trigger: typeof triggerManualBackup;
        checkHistory: typeof checkBackupHistory;
        verifySettings: typeof verifyBackupSettings;
        setTestInterval: typeof setTestBackupInterval;
      }
    }
  }
}

export function initBackupUtils() {
  if (typeof window !== 'undefined') {
    // Initialize the gamifiedTodoUtils object if it doesn't exist
    if (!window.gamifiedTodoUtils) {
      window.gamifiedTodoUtils = {
        backups: {
          trigger: triggerManualBackup,
          checkHistory: checkBackupHistory,
          verifySettings: verifyBackupSettings,
          setTestInterval: setTestBackupInterval
        }
      };
      console.log('Backup utilities exposed to window.gamifiedTodoUtils.backups');
      console.log('Available commands:');
      console.log('- window.gamifiedTodoUtils.backups.trigger()');
      console.log('- window.gamifiedTodoUtils.backups.checkHistory()');
      console.log('- window.gamifiedTodoUtils.backups.verifySettings()');
      console.log('- window.gamifiedTodoUtils.backups.setTestInterval(seconds)');
    }
  }
} 