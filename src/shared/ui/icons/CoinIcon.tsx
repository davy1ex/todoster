import { FC } from 'react';

interface CoinIconProps {
    width?: number;
    height?: number;
    className?: string;
}

export const CoinIcon: FC<CoinIconProps> = ({ 
    width = 16, 
    height = 16,
    className 
}) => {
    return (
        <svg 
            className={className}
            width={width} 
            height={height} 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle 
                cx="12" 
                cy="12" 
                r="8" 
                stroke="currentColor" 
                strokeWidth="2"
            />
            <path 
                d="M12 7V17M9 10L12 7L15 10" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round"
            />
        </svg>
    );
}; 