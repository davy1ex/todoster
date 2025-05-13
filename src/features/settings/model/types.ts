export interface SettingsContextType {
  isSettingsModalOpen: boolean;
  openSettingsModal: () => void;
  closeSettingsModal: () => void;
  clearAccountData: () => void;
  exportAccountData: () => void;
  importAccountData: (data: string) => void;
}
