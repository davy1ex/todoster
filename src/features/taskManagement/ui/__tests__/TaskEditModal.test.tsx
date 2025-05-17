import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TaskEditModal } from '../TaskEditModal';
import type { Task } from '@/entities/task';

describe('Task Editing Tests', () => {
    const mockTask: Task = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        isDone: false,
        list: 'Inbox',
        reward: 10,
        date_box: 'today',
        createdAt: new Date(),
        updatedAt: new Date(),
        isArchived: false
    };

    const mockProps = {
        isOpen: true,
        task: mockTask,
        onClose: jest.fn(),
        onUpdateTask: jest.fn(),
        onChangeReward: jest.fn(),
        onCheckTask: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Can open task edit modal', () => {
        render(<TaskEditModal {...mockProps} />);
        
        expect(screen.getByText('Edit task')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    });

    test('Modal does not render when closed', () => {
        render(<TaskEditModal {...mockProps} isOpen={false} />);
        
        expect(screen.queryByText('Edit task')).not.toBeInTheDocument();
    });

    test('Can edit task title', () => {
        render(<TaskEditModal {...mockProps} />);
        
        const titleInput = screen.getByPlaceholderText('Task title');
        fireEvent.change(titleInput, { target: { value: 'Updated Task Title' } });
        
        expect(mockProps.onUpdateTask).toHaveBeenCalledWith(mockTask.id, {
            title: 'Updated Task Title'
        });
    });

    test('Can edit task description', () => {
        render(<TaskEditModal {...mockProps} />);
        
        const descriptionInput = screen.getByPlaceholderText('Task description...');
        fireEvent.change(descriptionInput, { target: { value: 'Updated description' } });
        
        expect(mockProps.onUpdateTask).toHaveBeenCalledWith(mockTask.id, {
            description: 'Updated description'
        });
    });

    test('Can change task reward points', () => {
        render(<TaskEditModal {...mockProps} />);
        
        const rewardInput = screen.getByPlaceholderText('Enter coins');
        fireEvent.change(rewardInput, { target: { value: '20' } });
        
        const setCoinsButton = screen.getByText('Set coins');
        fireEvent.click(setCoinsButton);
        
        expect(mockProps.onChangeReward).toHaveBeenCalledWith(20);
        expect(mockProps.onUpdateTask).toHaveBeenCalledWith(mockTask.id, {
            reward: 20
        });
    });

    test('Cannot set negative reward points', () => {
        render(<TaskEditModal {...mockProps} />);
        
        const rewardInput = screen.getByPlaceholderText('Enter coins');
        fireEvent.change(rewardInput, { target: { value: '-5' } });
        
        const setCoinsButton = screen.getByText('Set coins');
        expect(setCoinsButton).toBeDisabled();
    });

    test('Can toggle task completion', () => {
        render(<TaskEditModal {...mockProps} />);
        
        const checkbox = screen.getByLabelText('Completed');
        fireEvent.click(checkbox);
        
        expect(mockProps.onCheckTask).toHaveBeenCalledWith(mockTask.id);
    });

    test('Can change task list between Inbox and Backlog', () => {
        render(<TaskEditModal {...mockProps} />);
        
        const listSelect = screen.getByDisplayValue('Inbox');
        fireEvent.change(listSelect, { target: { value: 'Backlog' } });
        
        expect(mockProps.onUpdateTask).toHaveBeenCalledWith(mockTask.id, {
            list: 'Backlog'
        });
    });

    test('Can change date box for backlog tasks', () => {
        render(
            <TaskEditModal 
                {...mockProps} 
                task={{ ...mockTask, list: 'Backlog', date_box: 'today' }}
            />
        );
        
        const dateBoxSelect = screen.getByDisplayValue('Today');
        expect(dateBoxSelect).toBeInTheDocument();
        
        fireEvent.change(dateBoxSelect, { target: { value: 'week' } });
        
        expect(mockProps.onUpdateTask).toHaveBeenCalledWith(mockTask.id, {
            date_box: 'week'
        });
    });

    test('Date box selector only appears for Backlog tasks', () => {
        const { rerender } = render(<TaskEditModal {...mockProps} />);
        
        // For Inbox tasks
        expect(screen.queryByDisplayValue('Today')).not.toBeInTheDocument();
        
        // For Backlog tasks
        rerender(
            <TaskEditModal 
                {...mockProps} 
                task={{ ...mockTask, list: 'Backlog', date_box: 'today' }}
            />
        );
        expect(screen.getByDisplayValue('Today')).toBeInTheDocument();
    });

    test('Modal closes correctly', () => {
        render(<TaskEditModal {...mockProps} />);
        
        const closeButton = screen.getByRole('button', { name: /close/i });
        fireEvent.click(closeButton);
        
        expect(mockProps.onClose).toHaveBeenCalled();
    });

    test('Shows current reward value', () => {
        render(<TaskEditModal {...mockProps} />);
        
        expect(screen.getByText('Current reward: 10 coins')).toBeInTheDocument();
    });

    test('Can input reward using input field', () => {
        render(<TaskEditModal {...mockProps} />);
        
        // Get the reward input field
        const rewardInput = screen.getByPlaceholderText('Enter coins');
        
        // Test different valid inputs
        fireEvent.change(rewardInput, { target: { value: '25' } });
        const setCoinsButton = screen.getByText('Set coins');
        fireEvent.click(setCoinsButton);
        
        expect(mockProps.onChangeReward).toHaveBeenCalledWith(25);
        expect(mockProps.onUpdateTask).toHaveBeenCalledWith(mockTask.id, {
            reward: 25
        });

        // Test decimal input (should be converted to number)
        fireEvent.change(rewardInput, { target: { value: '30.75' } });
        fireEvent.click(setCoinsButton);
        
        expect(mockProps.onChangeReward).toHaveBeenCalledWith(30.75);
        expect(mockProps.onUpdateTask).toHaveBeenCalledWith(mockTask.id, {
            reward: 30.75
        });

        // Test large number input
        fireEvent.change(rewardInput, { target: { value: '999' } });
        fireEvent.click(setCoinsButton);
        
        expect(mockProps.onChangeReward).toHaveBeenCalledWith(999);
        expect(mockProps.onUpdateTask).toHaveBeenCalledWith(mockTask.id, {
            reward: 999
        });

        // Test input field constraints
        fireEvent.change(rewardInput, { target: { value: '-5' } });
        expect(setCoinsButton).toBeDisabled(); // Button should be disabled for negative values

        fireEvent.change(rewardInput, { target: { value: 'abc' } });
        expect(rewardInput).toHaveValue(0); // Non-numeric input should be converted to 0
        expect(setCoinsButton).toBeDisabled(); // Button should be disabled for 0
    });

    test('Modal closes when pressing Escape key', () => {
        render(<TaskEditModal {...mockProps} />);
        
        // Simulate pressing Escape key
        fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
        
        expect(mockProps.onClose).toHaveBeenCalled();
    });

    test('Modal closes when clicking outside', () => {
        render(<TaskEditModal {...mockProps} />);
        
        // Get the modal backdrop (the area outside the modal content)
        const modalBackdrop = screen.getByRole('dialog');
        if (!modalBackdrop) throw new Error('Modal backdrop not found');
        fireEvent.click(modalBackdrop);
        
        expect(mockProps.onClose).toHaveBeenCalled();
    });

    test('Modal does not close when clicking inside', () => {
        render(<TaskEditModal {...mockProps} />);
        
        // Click inside the modal content
        const modalContent = screen.getByRole('dialog').querySelector('.modal__content');
        if (!modalContent) throw new Error('Modal content not found');
        fireEvent.click(modalContent);
        
        expect(mockProps.onClose).not.toHaveBeenCalled();
    });

    test('Can increment reward using spinbutton up arrow', () => {
        render(<TaskEditModal {...mockProps} />);
        
        const rewardInput = screen.getByPlaceholderText('Enter coins');
        fireEvent.change(rewardInput, { target: { value: '10' } });
        
        // Simulate clicking the up arrow
        fireEvent.keyDown(rewardInput, { key: 'ArrowUp', code: 'ArrowUp' });
        expect(rewardInput).toHaveValue(11);
    });

    test('Can decrement reward using spinbutton down arrow', () => {
        render(<TaskEditModal {...mockProps} />);
        
        const rewardInput = screen.getByPlaceholderText('Enter coins');
        fireEvent.change(rewardInput, { target: { value: '10' } });
        
        // Simulate clicking the down arrow
        fireEvent.keyDown(rewardInput, { key: 'ArrowDown', code: 'ArrowDown' });
        expect(rewardInput).toHaveValue(9);
    });

    test('Cannot decrement reward below zero using spinbutton', () => {
        render(<TaskEditModal {...mockProps} />);
        
        const rewardInput = screen.getByPlaceholderText('Enter coins');
        fireEvent.change(rewardInput, { target: { value: '0' } });
        
        // Attempt to decrement below zero
        fireEvent.keyDown(rewardInput, { key: 'ArrowDown', code: 'ArrowDown' });
        expect(rewardInput).toHaveValue(0);
    });
}); 