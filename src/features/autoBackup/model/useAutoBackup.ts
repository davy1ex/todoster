import { useState, useEffect, useCallback, useRef } from 'react';

// Default backup interval in milliseconds (5 minutes)
const DEFAULT_BACKUP_INTERVAL = 5 * 60 * 1000;

// Static references for singleton pattern
let isInitialized = false;
let globalIntervalId: number | null = null;
let backupCount = 0;
let isStorageFull = false;
// Track the last file backup time to prevent duplicates
let lastFileBackupTime = 0;
// Track instance IDs to ensure they're truly unique
const activeInstances = new Set<string>();
// Store counter for truly unique IDs across module reloads
let instanceCounter = 0;

export interface AutoBackupSettings {
  enabled: boolean;
  interval: number; // in milliseconds
  maxBackups: number;
  lastBackupTime: number | null;
  fileBackupEnabled: boolean; // Controls whether to save backups as files
  fileBackupInterval: number; // How often to save file backups (in terms of backup count)
}

const DEFAULT_SETTINGS: AutoBackupSettings = {
  enabled: true,
  interval: DEFAULT_BACKUP_INTERVAL,
  maxBackups: 3, // Reduced from 5 to save space
  lastBackupTime: null,
  fileBackupEnabled: true,
  fileBackupInterval: 1, // Save a file every backup
};

// Generate a truly unique instance ID
const generateUniqueId = (): string => {
  // Use a combination of random string and incrementing counter
  // The counter ensures uniqueness even if module reloads
  instanceCounter++;
  const randomPart = Math.random().toString(36).substring(2, 6);
  const id = `${randomPart}-${instanceCounter}`;
  activeInstances.add(id);
  return id;
};

export const useAutoBackup = () => {
  const instanceId = useRef(generateUniqueId());
  console.log(`useAutoBackup hook initialized (instance: ${instanceId.current})`);
  
  // Track primary instance status
  const isPrimaryRef = useRef(false);
  
  // Load settings from localStorage or use defaults
  const loadSettings = (): AutoBackupSettings => {
    const savedSettings = localStorage.getItem('autoBackupSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      console.log(`[${instanceId.current}] Loaded auto-backup settings:`, parsed);
      return parsed;
    }
    console.log(`[${instanceId.current}] Using default auto-backup settings`);
    return DEFAULT_SETTINGS;
  };

  const [settings, setSettings] = useState<AutoBackupSettings>(loadSettings());
  const backupCountRef = useRef(backupCount);
  const intervalIdRef = useRef<number | null>(null);
  const storageFullRef = useRef(isStorageFull);

  // Singleton check effect
  useEffect(() => {
    if (isInitialized) {
      console.log(`[${instanceId.current}] Another instance already initialized, this is a duplicate`);
      isPrimaryRef.current = false;
    } else {
      console.log(`[${instanceId.current}] First initialization, this is the primary instance`);
      isInitialized = true;
      isPrimaryRef.current = true;
    }
    
    return () => {
      // Only release singleton if this is the primary instance
      if (isPrimaryRef.current) {
        console.log(`[${instanceId.current}] Primary instance unmounting, releasing singleton lock`);
        isInitialized = false;
      }
      
      // Remove from active instances set
      activeInstances.delete(instanceId.current);
    };
  }, []);

  // Save settings to localStorage
  const saveSettings = useCallback((newSettings: AutoBackupSettings) => {
    console.log(`[${instanceId.current}] Saving new auto-backup settings:`, newSettings);
    try {
      localStorage.setItem('autoBackupSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error(`[${instanceId.current}] Failed to save settings:`, error);
      // Still update state even if localStorage fails
      setSettings(newSettings);
      storageFullRef.current = true;
      isStorageFull = true;
    }
  }, [instanceId]);

  // Toggle auto-backup feature
  const toggleAutoBackup = useCallback(() => {
    console.log(`[${instanceId.current}] Toggling auto-backup:`, !settings.enabled);
    saveSettings({
      ...settings,
      enabled: !settings.enabled,
    });
  }, [settings, saveSettings, instanceId]);

  // Toggle file backup feature
  const toggleFileBackup = useCallback(() => {
    console.log(`[${instanceId.current}] Toggling file backup:`, !settings.fileBackupEnabled);
    saveSettings({
      ...settings,
      fileBackupEnabled: !settings.fileBackupEnabled,
    });
  }, [settings, saveSettings, instanceId]);

  // Change backup interval
  const setBackupInterval = useCallback((interval: number) => {
    console.log(`[${instanceId.current}] Setting backup interval to:`, interval);
    saveSettings({
      ...settings,
      interval,
    });
  }, [settings, saveSettings, instanceId]);

  // Set file backup interval
  const setFileBackupInterval = useCallback((interval: number) => {
    console.log(`[${instanceId.current}] Setting file backup interval to:`, interval);
    saveSettings({
      ...settings,
      fileBackupInterval: interval,
    });
  }, [settings, saveSettings, instanceId]);

  // Set maximum number of backups to keep
  const setMaxBackups = useCallback((maxBackups: number) => {
    console.log(`[${instanceId.current}] Setting max backups to:`, maxBackups);
    saveSettings({
      ...settings,
      maxBackups,
    });
  }, [settings, saveSettings, instanceId]);

  // Create a file download from data (debounced to prevent multiple downloads)
  const downloadBackupFile = useCallback((data: string) => {
    const now = Date.now();
    // Prevent duplicate downloads within 2 seconds of each other
    if (now - lastFileBackupTime < 2000) {
      console.log(`[${instanceId.current}] Skipping duplicate file backup (too soon after last one)`);
      return;
    }
    
    // Update the last backup time
    lastFileBackupTime = now;
    
    console.log(`[${instanceId.current}] Creating file backup download`);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `gamified-todo-backup-${timestamp}.json`;
    
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log(`[${instanceId.current}] File backup download initiated:`, fileName);
  }, [instanceId]);

  // Clean up space in localStorage by removing old backups
  const cleanupStorage = useCallback(() => {
    // Skip if not primary
    if (!isPrimaryRef.current) {
      console.log(`[${instanceId.current}] Skipping storage cleanup - not primary instance`);
      return false;
    }
    
    console.log(`[${instanceId.current}] Emergency cleanup of localStorage to free space`);
    // First, try to remove all but the most recent backup
    const backups = Object.keys(localStorage)
      .filter(key => key.startsWith('auto_backup_'))
      .sort((a, b) => {
        // Sort by timestamp (newest first)
        const timeA = parseInt(a.split('_')[2]);
        const timeB = parseInt(b.split('_')[2]);
        return timeB - timeA;
      });
    
    // Keep only the most recent backup
    if (backups.length > 1) {
      console.log(`[${instanceId.current}] Removing ${backups.length - 1} backups to free space`);
      backups.slice(1).forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (e) {
          console.error(`[${instanceId.current}] Error removing backup:`, e);
        }
      });
      return true;
    }
    
    // If still not enough space, remove all backups
    if (storageFullRef.current) {
      console.log(`[${instanceId.current}] Still not enough space, removing all backups`);
      backups.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (e) {
          console.error(`[${instanceId.current}] Error removing all backups:`, e);
        }
      });
      return true;
    }
    
    return false;
  }, [instanceId]);

  // Create a backup
  const createBackup = useCallback(() => {
    // Skip if not the primary instance
    if (!isPrimaryRef.current) {
      console.log(`[${instanceId.current}] Skipping backup - not the primary instance`);
      return false;
    }
    
    console.log(`[${instanceId.current}] Creating backup...`);
    try {
      // Get all data from localStorage BUT exclude previous backups
      const backupData: Record<string, string> = {};
      
      // Only include non-backup localStorage items
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i) || '';
        // Skip previous backups and settings when creating a new backup
        if (!key.startsWith('auto_backup_')) {
          const value = localStorage.getItem(key);
          if (value !== null) {
            backupData[key] = value;
          }
        }
      }
      
      const data = JSON.stringify(backupData);
      
      // Generate timestamp
      const timestamp = Date.now();
      
      try {
        // Save backup to localStorage with timestamp
        localStorage.setItem(`auto_backup_${timestamp}`, data);
        console.log(`[${instanceId.current}] Backup created with ID: auto_backup_${timestamp}`);
        
        // Update last backup time
        saveSettings({
          ...settings,
          lastBackupTime: timestamp,
        });
        
        // Reset storage full flag
        storageFullRef.current = false;
        isStorageFull = false;
        
        // Clean up old backups
        cleanupOldBackups(settings.maxBackups);
      } catch (storageError) {
        console.error(`[${instanceId.current}] Storage error during backup:`, storageError);
        storageFullRef.current = true;
        isStorageFull = true;
        
        // Try emergency cleanup
        if (cleanupStorage()) {
          console.log(`[${instanceId.current}] Retrying backup after cleanup`);
          try {
            localStorage.setItem(`auto_backup_${timestamp}`, data);
            console.log(`[${instanceId.current}] Backup created after cleanup with ID: auto_backup_${timestamp}`);
            
            // Update last backup time
            saveSettings({
              ...settings,
              lastBackupTime: timestamp,
            });
          } catch (retryError) {
            console.error(`[${instanceId.current}] Still can't create backup after cleanup:`, retryError);
            // If localStorage still fails, just update the timestamp and do file backup
            setSettings({
              ...settings,
              lastBackupTime: timestamp,
            });
          }
        } else {
          // Still update the timestamp even if backup fails
          setSettings({
            ...settings,
            lastBackupTime: timestamp,
          });
        }
      }

      // Increment backup counter regardless of localStorage success
      backupCountRef.current += 1;
      backupCount = backupCountRef.current;
      console.log(`[${instanceId.current}] Backup counter:`, backupCount);
      
      // Always create file backup when localStorage is full
      if (settings.fileBackupEnabled && 
          (storageFullRef.current || backupCount % settings.fileBackupInterval === 0)) {
        console.log(`[${instanceId.current}] Creating file backup (scheduled or storage full)`);
        downloadBackupFile(data);
      }
      
      return true;
    } catch (error) {
      console.error(`[${instanceId.current}] Failed to create auto-backup:`, error);
      return false;
    }
  }, [settings, saveSettings, downloadBackupFile, cleanupStorage, instanceId]);

  // Trigger a file backup immediately
  const createFileBackup = useCallback(() => {
    console.log(`[${instanceId.current}] Manual file backup requested`);
    try {
      // Get all data from localStorage BUT exclude previous backups
      const backupData: Record<string, string> = {};
      
      // Only include non-backup localStorage items
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i) || '';
        // Skip previous backups when creating a new backup
        if (!key.startsWith('auto_backup_')) {
          const value = localStorage.getItem(key);
          if (value !== null) {
            backupData[key] = value;
          }
        }
      }
      
      const data = JSON.stringify(backupData);
      downloadBackupFile(data);
      return true;
    } catch (error) {
      console.error(`[${instanceId.current}] Failed to create file backup:`, error);
      return false;
    }
  }, [downloadBackupFile, instanceId]);

  // Cleanup old backups
  const cleanupOldBackups = useCallback((maxToKeep: number) => {
    // Skip if not primary
    if (!isPrimaryRef.current) {
      console.log(`[${instanceId.current}] Skipping cleanup - not primary instance`);
      return;
    }
    
    // Get all backup keys
    const allBackupKeys = Object.keys(localStorage)
      .filter(key => key.startsWith('auto_backup_'))
      .sort((a, b) => {
        // Sort by timestamp (newest first)
        const timeA = parseInt(a.split('_')[2]);
        const timeB = parseInt(b.split('_')[2]);
        return timeB - timeA;
      });
    
    console.log(`[${instanceId.current}] Found ${allBackupKeys.length} backups, keeping ${maxToKeep}`);
    
    // Remove older backups beyond the max limit
    if (allBackupKeys.length > maxToKeep) {
      const toRemove = allBackupKeys.slice(maxToKeep);
      console.log(`[${instanceId.current}] Removing ${toRemove.length} old backups`);
      
      // Try to remove each backup
      toRemove.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (e) {
          console.error(`[${instanceId.current}] Failed to remove backup ${key}:`, e);
          storageFullRef.current = true;
          isStorageFull = true;
        }
      });
    }
  }, [instanceId]);

  // Get all available backups
  const getBackups = useCallback(() => {
    return Object.keys(localStorage)
      .filter(key => key.startsWith('auto_backup_'))
      .map(key => {
        const timestamp = parseInt(key.split('_')[2]);
        return {
          id: key,
          timestamp,
          date: new Date(timestamp).toLocaleString(),
        };
      })
      .sort((a, b) => b.timestamp - a.timestamp);
  }, []);

  // Get storage usage info
  const getStorageInfo = useCallback(() => {
    try {
      let totalSize = 0;
      let backupSize = 0;
      
      // Calculate size of all items
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i) || '';
        const value = localStorage.getItem(key) || '';
        const itemSize = key.length + value.length;
        totalSize += itemSize;
        
        if (key.startsWith('auto_backup_')) {
          backupSize += itemSize;
        }
      }
      
      // Convert to KB
      totalSize = Math.round(totalSize / 1024);
      backupSize = Math.round(backupSize / 1024);
      
      return {
        totalSizeKB: totalSize,
        backupSizeKB: backupSize,
        backupCount: getBackups().length,
        isStorageFull: storageFullRef.current
      };
    } catch (e) {
      console.error(`[${instanceId.current}] Error calculating storage info:`, e);
      return {
        totalSizeKB: 0,
        backupSizeKB: 0,
        backupCount: 0,
        isStorageFull: true
      };
    }
  }, [getBackups, instanceId]);

  // Restore from backup
  const restoreBackup = useCallback((backupId: string) => {
    console.log(`[${instanceId.current}] Restoring from backup:`, backupId);
    try {
      const backupData = localStorage.getItem(backupId);
      if (!backupData) return false;
      
      // Clear current localStorage except for backup-related items
      Object.keys(localStorage)
        .filter(key => !key.startsWith('auto_backup_') && key !== 'autoBackupSettings')
        .forEach(key => {
          try {
            localStorage.removeItem(key);
          } catch (e) {
            console.error(`[${instanceId.current}] Failed to remove item ${key} during restore:`, e);
          }
        });
      
      // Restore data
      try {
        const parsedData = JSON.parse(backupData);
        console.log(`[${instanceId.current}] Parsed backup data:`, Object.keys(parsedData));
        
        Object.entries(parsedData).forEach(([key, value]) => {
          // Don't restore autoBackupSettings or any backup files
          if (!key.startsWith('auto_backup_') && key !== 'autoBackupSettings') {
            try {
              localStorage.setItem(key, value as string);
              console.log(`[${instanceId.current}] Restored item: ${key}`);
            } catch (e) {
              console.error(`[${instanceId.current}] Failed to restore item ${key}:`, e);
              storageFullRef.current = true;
              isStorageFull = true;
            }
          }
        });
        console.log(`[${instanceId.current}] Backup restored successfully`);
        return true;
      } catch (parseError) {
        console.error(`[${instanceId.current}] Failed to parse backup data:`, parseError);
        return false;
      }
    } catch (error) {
      console.error(`[${instanceId.current}] Failed to restore backup:`, error);
      return false;
    }
  }, [instanceId]);

  // Import a backup file
  const importBackupFile = useCallback((file: File) => {
    console.log(`[${instanceId.current}] Importing backup file:`, file.name);
    return new Promise<boolean>((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result;
          if (typeof content === 'string') {
            // First make sure we have space
            cleanupStorage();
            
            // Store this as a backup in localStorage
            const timestamp = Date.now();
            try {
              localStorage.setItem(`auto_backup_${timestamp}`, content);
              console.log(`[${instanceId.current}] Imported backup saved with ID: auto_backup_${timestamp}`);
              
              // Update last backup time
              saveSettings({
                ...settings,
                lastBackupTime: timestamp,
              });
              
              // Clean up old backups
              cleanupOldBackups(settings.maxBackups);
              resolve(true);
            } catch (storageError) {
              console.error(`[${instanceId.current}] Failed to save imported backup to localStorage:`, storageError);
              storageFullRef.current = true;
              isStorageFull = true;
              
              // Even though localStorage failed, mark as successful since we have the file
              // Update the settings to show the import time
              setSettings({
                ...settings,
                lastBackupTime: timestamp,
              });
              resolve(true);
            }
          } else {
            resolve(false);
          }
        } catch (error) {
          console.error(`[${instanceId.current}] Failed to import backup file:`, error);
          resolve(false);
        }
      };
      
      reader.onerror = () => {
        console.error(`[${instanceId.current}] Error reading file`);
        resolve(false);
      };
      
      reader.readAsText(file);
    });
  }, [settings, saveSettings, cleanupOldBackups, cleanupStorage, instanceId]);

  // Delete a specific backup
  const deleteBackup = useCallback((backupId: string) => {
    console.log(`[${instanceId.current}] Deleting backup:`, backupId);
    try {
      localStorage.removeItem(backupId);
    } catch (e) {
      console.error(`[${instanceId.current}] Failed to delete backup ${backupId}:`, e);
      storageFullRef.current = true;
      isStorageFull = true;
    }
  }, [instanceId]);

  // Function to start the backup interval
  const startBackupInterval = useCallback(() => {
    // Only the primary instance should manage intervals
    if (!isPrimaryRef.current) {
      console.log(`[${instanceId.current}] Not setting up interval - this is not the primary instance`);
      return;
    }
    
    // Clear any existing interval (both local and global)
    if (intervalIdRef.current !== null) {
      console.log(`[${instanceId.current}] Clearing existing local interval:`, intervalIdRef.current);
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    
    if (globalIntervalId !== null) {
      console.log(`[${instanceId.current}] Clearing existing global interval:`, globalIntervalId);
      clearInterval(globalIntervalId);
      globalIntervalId = null;
    }
    
    if (!settings.enabled) {
      console.log(`[${instanceId.current}] Auto-backup is disabled, not starting interval`);
      return;
    }

    // Check if it's been less than the interval since the last backup
    const now = Date.now();
    const lastBackup = settings.lastBackupTime || 0;
    const timeSinceLastBackup = now - lastBackup;
    
    console.log(`[${instanceId.current}] Starting auto-backup interval: ${settings.interval}ms. Last backup was ${timeSinceLastBackup}ms ago.`);
    
    // Create an initial backup only if one hasn't been made recently
    if (!settings.lastBackupTime || timeSinceLastBackup >= settings.interval) {
      console.log(`[${instanceId.current}] Creating initial backup upon starting auto-backup (none recently)`);
      createBackup();
    } else {
      console.log(`[${instanceId.current}] Skipping initial backup as one was made recently`);
    }
    
    // Schedule regular backups
    const newIntervalId = window.setInterval(() => {
      const currentTime = new Date();
      console.log(`[${instanceId.current}] Auto-backup interval triggered at ${currentTime.toLocaleTimeString()}`);
      createBackup();
    }, settings.interval) as any;
    
    // Store the interval ID both locally and globally
    intervalIdRef.current = newIntervalId;
    globalIntervalId = newIntervalId;
    
    console.log(`[${instanceId.current}] Backup interval started with ID:`, newIntervalId);
  }, [settings.enabled, settings.interval, settings.lastBackupTime, createBackup, instanceId]);

  // Auto-backup effect - handle interval changes
  useEffect(() => {
    // Only the primary instance should handle intervals
    if (isPrimaryRef.current) {
      console.log(`[${instanceId.current}] Auto-backup effect running, enabled:`, settings.enabled, "interval:", settings.interval);
      startBackupInterval();
    } else {
      console.log(`[${instanceId.current}] Skipping interval setup - not primary instance`);
    }
    
    // Cleanup function
    return () => {
      if (intervalIdRef.current !== null) {
        console.log(`[${instanceId.current}] Cleaning up auto-backup interval`, intervalIdRef.current);
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
        
        // Only clear the global interval if it matches our local one
        if (globalIntervalId === intervalIdRef.current) {
          globalIntervalId = null;
        }
      }
    };
  }, [settings.enabled, settings.interval, instanceId]);

  // For debugging: log when the component mounts
  useEffect(() => {
    console.log(`[${instanceId.current}] Auto-backup hook mounted`);
    return () => {
      console.log(`[${instanceId.current}] Auto-backup hook unmounted`);
    };
  }, [instanceId]);

  return {
    settings,
    toggleAutoBackup,
    toggleFileBackup,
    setBackupInterval,
    setFileBackupInterval,
    setMaxBackups,
    createBackup,
    createFileBackup,
    getBackups,
    restoreBackup,
    importBackupFile,
    deleteBackup,
    getStorageInfo,
    isStorageFull: storageFullRef.current
  };
}; 