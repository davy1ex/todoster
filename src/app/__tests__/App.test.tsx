import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { App } from '../App';
import { taskStore } from '@/entities/task/model/store';
import type { Platform } from '../lib/platform';

const mockPlatform: Platform = {
    type: 'web',
    isElectron: false,
    isAndroid: false,
    isWeb: true
};

jest.mock('@/entities/task/model/store');

describe('Core Application Tests', () => {
    beforeEach(() => {
        taskStore.setState({ tasks: [], archivedTasks: [] });
    });

    describe('1. Application renders successfully', () => {
        test('Header is present', () => {
            render(<App platform={mockPlatform} />);
            const header = screen.getByRole('banner');
            expect(header).toBeInTheDocument();
        });

        test('All main sections are visible', () => {
            render(<App platform={mockPlatform} />);
            
            // Check for Inbox section
            expect(screen.getByTestId('inbox-list')).toBeInTheDocument();
            
            // Check for Backlog section
            expect(screen.getByTestId('backlog-list')).toBeInTheDocument();
            
            // Check for Projects section
            expect(screen.getByTestId('projects-section')).toBeInTheDocument();
            
            // Check for Goals section
            expect(screen.getByTestId('goals-section')).toBeInTheDocument();
            
            // Check for Rewards section
            expect(screen.getByTestId('rewards-section')).toBeInTheDocument();
        });

        test('Points display in header', () => {
            render(<App platform={mockPlatform} />);
            const pointsDisplay = screen.getByTestId('points-display');
            expect(pointsDisplay).toBeInTheDocument();
            expect(pointsDisplay).toHaveTextContent('0'); // Initial points should be 0
        });

        test('Theme toggle works', () => {
            render(<App platform={mockPlatform} />);
            const themeToggle = screen.getByTestId('theme-toggle');
            expect(themeToggle).toBeInTheDocument();
        });
    });
}); 