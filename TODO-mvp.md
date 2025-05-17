# Gamified Todo App - MVP Speedrun Plan

# Refactor
- [ ] Rewrite tasks, backlog, projects, goals to feature based arch
- [ ] Rewrite modals to separete shared/ui for reuse
- [ ] Rewrite archive way for tasks, rewards, goals by feature way


## 1. Core Foundation
### 1.1 Project Setup
- [X] Init React project with Vite
- [X] Setup TypeScript
- [X] Install core dependencies
  - Zustand
  - React Router
  - Tailwind CSS

### 1.2 Basic Architecture
- [X] Create FSD folders
  - /features
  - /entities
  - /shared
  - /widgets
- [ ] Setup basic routing
- [X] Create layout template

## 2. State Management
### 2.1 Zustand Store
- [X] Create base store
- [X] Setup local storage persistence
- [X] Define core types

### 2.2 Core State Slices
- [X] Tasks slice
  - Task structure
  - CRUD actions
- [X] Lists slice
  - List structure
  - Default lists (Inbox, Today, Projects)
- [X] Rewards slice
  - Reward structure
  - Currency system

## 3. Features Implementation
### 3.1 Tasks Feature
- [X] Task creation form
- [X] Task list view
- [X] Task completion toggle
- [X] Task deletion
- [X] Basic task editing
- [ ] Funny animation on claim reward from checked task

### 3.2 Lists Feature
- [ ] Default lists implementation
  - Inbox view
  - Today view
  - Projects view
  - [ ] List switching
- [ ] Task filtering by list

### 3.3 Rewards Feature
- [ ] Basic rewards list
- [ ] Currency display
- [ ] Reward purchase mechanism

## 4. UI Components
### 4.1 Layout
- [ ] Main container
- [ ] Collapsible sidebar
- [ ] Content area

### 4.2 Task Components
- [ ] Task card
- [ ] Task form
- [ ] Task list container

### 4.3 Reward Components
- [ ] Reward card
- [ ] Currency display
- [ ] Rewards shop view

## Implementation Order
1. Project Setup (1.1)
2. Basic Architecture (1.2)
3. Base State Management (2.1)
4. Core State Slices (2.2)
5. Basic Layout (4.1)
6. Tasks MVP (3.1)
7. Lists MVP (3.2)
8. Rewards MVP (3.3)
9. UI Components (4.2, 4.3)

## Speedrun Rules
1. NO PERFECTING DURING IMPLEMENTATION
2. Focus on functionality first
3. Skip all styling initially except basic layout
4. Use minimal viable components
5. Implement features in isolation
6. Test only critical functionality

## Final Polish Phase
Only after MVP is working:
1. Improve UI/UX
2. Add animations
3. Refine styling
4. Optimize performance
5. Add error handling
6. Improve form validation
7. Add loading states
8. Implement proper TypeScript types

## Notes
- Keep components dumb initially
- Use minimal state management
- Skip optimizations until polish phase
- Use basic CSS layouts first
- Focus on core user flows 

# Testing Tasks for GamifiedTodo

## Core Application Tests
1. [x] Application renders successfully
   - [x] Header is present
   - [x] All main sections are visible (Inbox, Backlog, Projects, Goals, Rewards)
   - [x] Points display in header
   - [x] Theme toggle works

## Task Management Tests
1. [x] Task Creation
   - [x] Can add task to Inbox
   - [x] Can add task to Backlog
   - [x] Tasks have correct default values
   - [x] Cannot add empty tasks
   - [x] Enter key works for task creation
   - [x] Clear input after task creation
   - [ ] Task on create can setuped custom count of points reward by input field behind of taskname

2. [ ] Task Lists
   - [ ] Inbox List
     - [ ] Shows inbox tasks correctly
     - [ ] Shows empty state when no tasks
     - [ ] Can check/uncheck tasks
     - [ ] Can click task to open edit modal
     - [ ] Task added from inbox with date_box as 'later'
   - [ ] Backlog List
     - [ ] Shows backlog tasks correctly
     - [ ] Shows empty state when no tasks
     - [ ] Filters tasks by date box (Today/Week/Later)
     - [ ] Shows correct task counts in tabs
     - [ ] Can switch between date box views
     - [ ] Input task in taskinput.tsx added it to same selected date_box

3. [x] Task Editing
   - [x] Can open task edit modal
   - [x] Modal does not render when closed
   - [x] Can edit task title
   - [x] Can edit task description
   - [x] Can change task reward points
   - [x] Cannot set negative reward points
   - [x] Can toggle task completion
   - [x] Can change task list (Inbox/Backlog)
   - [x] Can change date box for backlog tasks
   - [x] Date box selector only appears for Backlog tasks
   - [x] Modal closes correctly by outside
   - [x] Modal closes correctly by ESC
   - [x] Modal does not close when clicking inside
   - [x] Can increment reward using spinbutton up arrow
   - [ ] Can input reward using input field
   - [x] Can decrement reward using spinbutton down arrow
   - [x] Cannot decrement reward below zero using spinbutton

4. [ ] Points System
   - [ ] Points increase when completing task
   - [ ] Points decrease when unchecking task
   - [ ] Points update correctly when changing task reward
   - [ ] Points persist between sessions

## Project Management Tests
1. [ ] Project List
   - [X] Can create new projects
   - [X] Can edit project details
   - [ ] Can delete projects
   - [X] Can archive projects
   - [X] Can filter projects by status (not_started, active, archived)
   - [ ] Shows empty state correctly

## Goals Management Tests
1. [ ] Goal List
   - [ ] Can create new goals
   - [ ] Can edit goal details
   - [ ] Can mark goals as complete
   - [ ] Shows progress correctly
   - [ ] Shows empty state correctly

## Rewards Management Tests
1. [ ] Rewards List
   - [ ] Can create new rewards
   - [ ] Can edit reward details
   - [ ] Can purchase rewards with points
   - [ ] Shows empty state correctly
   - [ ] Validates point balance for purchases

## Storage Tests
1. [ ] Data Persistence
   - [ ] Tasks persist between sessions
   - [ ] Points persist between sessions
   - [ ] Projects persist between sessions
   - [ ] Goals persist between sessions
   - [ ] Rewards persist between sessions

## UI/UX Tests
1. [ ] Responsive Design
   - [ ] Works on mobile screens
   - [ ] Works on tablet screens
   - [ ] Works on desktop screens

2. [ ] Accessibility
   - [ ] All interactive elements are keyboard accessible
   - [ ] Proper ARIA labels are present
   - [ ] Color contrast meets WCAG standards

## Error Handling Tests
1. [ ] Form Validation
   - [ ] Shows appropriate error messages
   - [ ] Prevents invalid data submission

2. [ ] State Recovery
   - [ ] Handles network errors gracefully
   - [ ] Recovers from invalid states

## Integration Tests
1. [ ] Task-Project Integration
   - [ ] Tasks can be assigned to projects
   - [ ] Project progress updates with task completion

2. [ ] Task-Goal Integration
   - [ ] Tasks contribute to goal progress
   - [ ] Goal completion updates correctly

3. [ ] Points-Rewards Integration
   - [ ] Point balance updates correctly
   - [ ] Reward purchases affect point balance 