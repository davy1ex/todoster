import { FC } from 'react';
import { rewardStore } from '@/entities/reward/model/store';
import { appEvents, APP_EVENTS } from '@/shared/lib/events';
import { CoinIcon } from '@/shared/ui/icons';
import './Header.css';

interface HeaderProps {
    onToggleSidebar: () => void;
}

export const Header: FC<HeaderProps> = ({ onToggleSidebar }) => {
    const totalCoins = rewardStore((state) => state.totalCoins);

    const handleSettingsClick = () => {
        appEvents.emit(APP_EVENTS.OPEN_SETTINGS);
    };

    return (
        <header className="header">
            <div className="header__logo">
                <button 
                    className="header__sidebar-toggle"
                    onClick={onToggleSidebar}
                    aria-label="Toggle sidebar"
                >
                    ☰
                </button>
                <svg 
                    className="header__icon"
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path 
                        d="M15.7574 4.95592L19.0442 8.24264M18.3371 3.53553L20.4645 5.66289M11.0574 9.65592L17.0442 15.6427M2.73726 18.3371L9.43741 11.637M10.9999 20.4853L13.1272 18.3579M4.15768 16.9167L7.0441 19.8031" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round"
                    />
                </svg>
                <span className="header__title">GamifiedTodo</span>
            </div>
            
            <div className="header__actions">
                <div className="header__rewards" data-testid="points-display">
                    <CoinIcon className="header__coin-icon" width={24} height={24} />
                    <span className="header__coins">{totalCoins}</span>
                </div>

                <button 
                    onClick={handleSettingsClick}
                    className="header__settings-button"
                    data-testid="theme-toggle"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M10 13C11.6569 13 13 11.6569 13 10C13 8.34315 11.6569 7 10 7C8.34315 7 7 8.34315 7 10C7 11.6569 8.34315 13 10 13Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M16.7 13.7L15.3 12.3C15.1 12.1 15 11.8 15 11.5V8.5C15 8.2 15.1 7.9 15.3 7.7L16.7 6.3C17.1 5.9 17.1 5.3 16.7 4.9L15.1 3.3C14.7 2.9 14.1 2.9 13.7 3.3L12.3 4.7C12.1 4.9 11.8 5 11.5 5H8.5C8.2 5 7.9 4.9 7.7 4.7L6.3 3.3C5.9 2.9 5.3 2.9 4.9 3.3L3.3 4.9C2.9 5.3 2.9 5.9 3.3 6.3L4.7 7.7C4.9 7.9 5 8.2 5 8.5V11.5C5 11.8 4.9 12.1 4.7 12.3L3.3 13.7C2.9 14.1 2.9 14.7 3.3 15.1L4.9 16.7C5.3 17.1 5.9 17.1 6.3 16.7L7.7 15.3C7.9 15.1 8.2 15 8.5 15H11.5C11.8 15 12.1 15.1 12.3 15.3L13.7 16.7C14.1 17.1 14.7 17.1 15.1 16.7L16.7 15.1C17.1 14.7 17.1 14.1 16.7 13.7Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>
        </header>
    );
}; 