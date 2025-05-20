// Utility for testing auto-backup functionality

// This function can be called from the browser console to trigger a backup
export function triggerManualBackup() {
  // Find our hook in window.__REACT_DEVTOOLS_GLOBAL_HOOK__
  try {
    if (typeof window !== 'undefined') {
      console.log('Attempting to manually trigger a backup...');
      
      // Create a simple backup directly
      const timestamp = Date.now();
      const data = JSON.stringify(localStorage);
      localStorage.setItem(`auto_backup_${timestamp}`, data);
      console.log(`Manual backup created with ID: auto_backup_${timestamp}`);
      
      // Also update settings to trigger the indicator
      const settingsStr = localStorage.getItem('autoBackupSettings');
      if (settingsStr) {
        const settings = JSON.parse(settingsStr);
        settings.lastBackupTime = timestamp;
        localStorage.setItem('autoBackupSettings', JSON.stringify(settings));
        console.log('Updated lastBackupTime in settings');
      }
      
      // Simulate a storage event
      window.dispatchEvent(new Event('storage'));
      
      return true;
    }
  } catch (error) {
    console.error('Error triggering manual backup:', error);
  }
  return false;
}

// This function checks the backup history
export function checkBackupHistory() {
  const backups = Object.keys(localStorage)
    .filter(key => key.startsWith('auto_backup_'))
    .map(key => {
      const timestamp = parseInt(key.split('_')[2]);
      return {
        id: key,
        timestamp,
        date: new Date(timestamp).toLocaleString(),
        age: Math.round((Date.now() - timestamp) / 1000) + ' seconds ago'
      };
    })
    .sort((a, b) => b.timestamp - a.timestamp);
  
  console.log('Found', backups.length, 'backups:');
  console.table(backups);
  return backups;
}

// This function verifies the settings
export function verifyBackupSettings() {
  const settingsStr = localStorage.getItem('autoBackupSettings');
  if (settingsStr) {
    const settings = JSON.parse(settingsStr);
    console.log('Current auto-backup settings:', settings);
    console.log('Backup interval:', settings.interval / 1000, 'seconds');
    console.log('Enabled:', settings.enabled);
    console.log('File backup enabled:', settings.fileBackupEnabled);
    console.log('Last backup:', settings.lastBackupTime ? 
      new Date(settings.lastBackupTime).toLocaleString() : 'None');
    return settings;
  } 
  console.log('No auto-backup settings found');
  return null;
}

// This function can be called to update the interval for testing
export function setTestBackupInterval(seconds: number) {
  const settingsStr = localStorage.getItem('autoBackupSettings');
  if (settingsStr) {
    const settings = JSON.parse(settingsStr);
    const oldInterval = settings.interval;
    settings.interval = seconds * 1000;
    localStorage.setItem('autoBackupSettings', JSON.stringify(settings));
    console.log(`Changed backup interval from ${oldInterval/1000}s to ${seconds}s`);
    
    // Simulate a storage event to notify components
    window.dispatchEvent(new Event('storage'));
    return true;
  }
  return false;
} 