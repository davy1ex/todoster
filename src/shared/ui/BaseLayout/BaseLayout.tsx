import { ReactNode, useRef, useState, MouseEvent } from 'react';
import './BaseLayout.css';

interface BaseLayoutProps {
    sidebarContent: ReactNode;
    mainContent: ReactNode;
    isSidebarOpen: boolean;
}

export const BaseLayout = ({ sidebarContent, mainContent, isSidebarOpen }: BaseLayoutProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        setStartX(e.pageX - (scrollContainerRef.current?.offsetLeft || 0));
        setScrollLeft(scrollContainerRef.current?.scrollLeft || 0);
    };

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
        const walk = (x - startX) * 2;
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = scrollLeft - walk;
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    return (
        <div className="baseLayout" role="main">
            <div className={`baseLayout__content ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
                <div className={`sidebar ${!isSidebarOpen ? 'sidebar-collapsed' : ''}`}>
                    {sidebarContent}
                </div>
                
                <div 
                    ref={scrollContainerRef}
                    className="baseLayout__content__lists"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                >
                    {mainContent}
                </div>
            </div>
        </div>
    );
}; 