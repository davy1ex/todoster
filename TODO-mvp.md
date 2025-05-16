# Gamified Todo App - MVP Speedrun Plan

# Refactor
- [ ] Rewrite tasks, backlog, projects, goals to feature based arch
- [ ] Rewrite modals to separete shared/ui for reuse


## 1. Core Foundation
### 1.1 Project Setup
- [ ] Init React project with Vite
- [ ] Setup TypeScript
- [ ] Install core dependencies
  - Zustand
  - React Router
  - Tailwind CSS

### 1.2 Basic Architecture
- [ ] Create FSD folders
  - /features
  - /entities
  - /shared
  - /widgets
- [ ] Setup basic routing
- [ ] Create layout template

## 2. State Management
### 2.1 Zustand Store
- [ ] Create base store
- [ ] Setup local storage persistence
- [ ] Define core types

### 2.2 Core State Slices
- [ ] Tasks slice
  - Task structure
  - CRUD actions
- [ ] Lists slice
  - List structure
  - Default lists (Inbox, Today, Projects)
- [ ] Rewards slice
  - Reward structure
  - Currency system

## 3. Features Implementation
### 3.1 Tasks Feature
- [ ] Task creation form
- [ ] Task list view
- [ ] Task completion toggle
- [ ] Task deletion
- [ ] Basic task editing

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