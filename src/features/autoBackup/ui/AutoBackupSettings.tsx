import { FC, useRef, useState, useEffect } from 'react';
import { useAutoBackup } from '../model/useAutoBackup';
import './AutoBackupSettings.css';

export const AutoBackupSettings: FC = () => {
  const {
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
    isStorageFull
  } = useAutoBackup();

  const backups = getBackups();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [storageInfo, setStorageInfo] = useState(getStorageInfo());
  
  // Update storage info periodically
  useEffect(() => {
    setStorageInfo(getStorageInfo());
    
    const storageCheckInterval = setInterval(() => {
      setStorageInfo(getStorageInfo());
    }, 10000); // Check every 10 seconds
    
    return () => clearInterval(storageCheckInterval);
  }, [getStorageInfo]);
  
  const handleIntervalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const minutes = parseInt(e.target.value);
    setBackupInterval(minutes * 60 * 1000); // Convert to milliseconds
  };
  
  const handleFileBackupIntervalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFileBackupInterval(parseInt(e.target.value));
  };
  
  const handleMaxBackupsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMaxBackups(parseInt(e.target.value));
  };
  
  const handleRestoreBackup = (backupId: string) => {
    if (window.confirm('Are you sure you want to restore this backup? Current data will be replaced.')) {
      if (restoreBackup(backupId)) {
        window.location.reload();
      } else {
        alert('Failed to restore backup');
      }
    }
  };
  
  const handleDeleteBackup = (backupId: string) => {
    if (window.confirm('Are you sure you want to delete this backup?')) {
      deleteBackup(backupId);
      // Force a re-render
      window.dispatchEvent(new Event('storage'));
      // Update storage info
      setStorageInfo(getStorageInfo());
    }
  };
  
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const success = await importBackupFile(file);
    if (success) {
      alert('Backup file imported successfully');
      // Force component refresh
      window.dispatchEvent(new Event('storage'));
      // Update storage info
      setStorageInfo(getStorageInfo());
    } else {
      alert('Failed to import backup file');
    }
  };
  
  const handleManualBackup = () => {
    if (createBackup()) {
      // Update storage info
      setStorageInfo(getStorageInfo());
    }
  };
  
  const handleManualFileBackup = () => {
    createFileBackup();
  };
  
  const getIntervalInMinutes = () => settings.interval / (60 * 1000);

  return (
    <div className="auto-backup-settings">
      <div className="auto-backup-settings__header">
        <h3>Auto-Backup Settings</h3>
        <div className="auto-backup-settings__toggle">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={toggleAutoBackup}
            />
            <span className="toggle-slider"></span>
          </label>
          <span>{settings.enabled ? 'Enabled' : 'Disabled'}</span>
        </div>
      </div>
      
      {isStorageFull && (
        <div className="auto-backup-settings__storage-full">
          <div className="auto-backup-settings__warning">
            <span className="auto-backup-settings__warning-icon">⚠️</span>
            <span>Storage full! Automatic backups to localStorage are disabled.</span>
          </div>
          <p className="auto-backup-settings__storage-note">
            Your browser's localStorage is full. File backups will continue to work.
            Consider deleting some old backups or reducing the "Keep Last" setting.
          </p>
        </div>
      )}
      
      <div className="auto-backup-settings__storage-info">
        <div className="auto-backup-settings__storage-bar">
          <div 
            className="auto-backup-settings__storage-used"
            style={{ 
              width: `${Math.min(storageInfo.backupSizeKB / 50, 100)}%`,
              backgroundColor: isStorageFull ? 'var(--color-error)' : 'var(--color-primary)'
            }}
          ></div>
        </div>
        <div className="auto-backup-settings__storage-details">
          <span>Backup storage: {storageInfo.backupSizeKB} KB</span>
          <span>Total storage: {storageInfo.totalSizeKB} KB</span>
          <span>Backups: {storageInfo.backupCount}</span>
        </div>
      </div>
      
      <div className="auto-backup-settings__options">
        <div className="auto-backup-settings__option">
          <label>Backup Every:</label>
          <select 
            value={getIntervalInMinutes()} 
            onChange={handleIntervalChange}
            disabled={!settings.enabled}
          >
            <option value="1">1 minute</option>
            <option value="5">5 minutes</option>
            <option value="10">10 minutes</option>
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
          </select>
        </div>
        
        <div className="auto-backup-settings__option">
          <label>Keep Last:</label>
          <select 
            value={settings.maxBackups} 
            onChange={handleMaxBackupsChange}
            disabled={!settings.enabled}
          >
            <option value="1">1 backup</option>
            <option value="2">2 backups</option>
            <option value="3">3 backups</option>
            <option value="5">5 backups</option>
          </select>
        </div>
        
        <button 
          className="auto-backup-settings__button auto-backup-settings__button--primary"
          onClick={handleManualBackup}
          disabled={!settings.enabled}
        >
          Create Backup Now
        </button>
      </div>
      
      {settings.lastBackupTime && (
        <div className="auto-backup-settings__last-backup">
          Last backup: {new Date(settings.lastBackupTime).toLocaleString()}
        </div>
      )}

      <div className="auto-backup-settings__file-backup">
        <div className="auto-backup-settings__header">
          <h4>File Backups</h4>
          <div className="auto-backup-settings__toggle">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.fileBackupEnabled}
                onChange={toggleFileBackup}
                disabled={!settings.enabled}
              />
              <span className="toggle-slider"></span>
            </label>
            <span>{settings.fileBackupEnabled ? 'Enabled' : 'Disabled'}</span>
          </div>
        </div>
        
        {settings.fileBackupEnabled && (
          <>
            <div className="auto-backup-settings__options">
              <div className="auto-backup-settings__option">
                <label>Save File Every:</label>
                <select 
                  value={settings.fileBackupInterval} 
                  onChange={handleFileBackupIntervalChange}
                  disabled={!settings.enabled || !settings.fileBackupEnabled}
                >
                  <option value="1">Every backup</option>
                  <option value="2">Every 2 backups</option>
                  <option value="5">Every 5 backups</option>
                  <option value="10">Every 10 backups</option>
                </select>
              </div>
              
              <div className="auto-backup-settings__file-actions">
                <button 
                  className="auto-backup-settings__button auto-backup-settings__button--primary"
                  onClick={handleManualFileBackup}
                  disabled={!settings.enabled}
                >
                  Download Backup File Now
                </button>
                
                <button 
                  className="auto-backup-settings__button auto-backup-settings__button--secondary"
                  onClick={handleImportClick}
                >
                  Import Backup File
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".json"
                  style={{ display: 'none' }}
                />
              </div>
            </div>
            <div className="auto-backup-settings__file-note">
              <p>
                File backups will be automatically downloaded to your computer.
                You may need to approve downloads if prompted by your browser.
              </p>
              {isStorageFull && (
                <p className="auto-backup-settings__storage-note--highlight">
                  <strong>Note:</strong> Since storage is full, file backups will be created 
                  on every backup attempt regardless of the interval setting.
                </p>
              )}
            </div>
          </>
        )}
      </div>
      
      {backups.length > 0 && (
        <div className="auto-backup-settings__backups">
          <h4>Available Backups</h4>
          <ul className="auto-backup-settings__backup-list">
            {backups.map(backup => (
              <li key={backup.id} className="auto-backup-settings__backup-item">
                <span className="auto-backup-settings__backup-date">
                  {backup.date}
                </span>
                <div className="auto-backup-settings__backup-actions">
                  <button
                    onClick={() => handleRestoreBackup(backup.id)}
                    className="auto-backup-settings__button auto-backup-settings__button--secondary"
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => handleDeleteBackup(backup.id)}
                    className="auto-backup-settings__button auto-backup-settings__button--danger"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}; 