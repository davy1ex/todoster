import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from './App';

// Mock the task store
vi.mock('@/entities/task/model/store');

describe('App', () => {
    it('renders without crashing', () => {
        render(<App platform="web" />);
        
        // Check for app title
        const titleElement = screen.getByText('Task App');
        expect(titleElement).toBeInTheDocument();
    });

    it('renders task lists', () => {
        render(<App platform="web" />);
        
        // Check for both task lists
        const inboxList = screen.getByText('Inbox');
        const backlogList = screen.getByText('Backlog');
        
        expect(inboxList).toBeInTheDocument();
        expect(backlogList).toBeInTheDocument();
    });
}); 