# Gamified Todo App

A modern application with gamification elements and brain dumping capabilities, built with React and TypeScript, exist for simplify your life.

## Table of Contents
- [Gamified Todo App](#gamified-todo-app)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
    - [1. Task Management](#1-task-management)
    - [2. Gamification System](#2-gamification-system)
    - [3. Brain Dump Feature](#3-brain-dump-feature)
    - [4. User Interface](#4-user-interface)
    - [5. Data Persistence](#5-data-persistence)
    - [6. Task Organization](#6-task-organization)
    - [7. Architecture](#7-architecture)
  - [Technical Stack](#technical-stack)
  - [Getting Started](#getting-started)
  - [How to Run](#how-to-run)
    - [Development Mode](#development-mode)
  - [Project Structure](#project-structure)
  - [Contributing](#contributing)
  - [License](#license)

## Features

### 1. Task Management
- Create, update, and delete tasks
- Organize tasks into lists (Inbox, Backlog)
- Mark tasks as complete/incomplete
- Task details include:
  - Title
  - Description
  - Status (Done/Not Done)
  - List assignment
  - Reward points
  - Creation and update timestamps

### 2. Gamification System
- Reward points for completing tasks
- Customizable reward amounts per task
- Points persist across sessions
- Update rewards through task modal
- Visual feedback for reward changes

### 3. Brain Dump Feature
- Quick thought capture system
- Persistent textarea for continuous writing
- Save and clear functionality
- Historical entries with timestamps
- Delete individual entries
- Automatic local storage
- Clean, distraction-free interface

### 4. User Interface
- Modern, clean design
- Responsive layout
- Intuitive controls
- Smooth transitions and animations
- Clear visual hierarchy
- Accessible components

### 5. Data Persistence
- Local storage integration
- Automatic saving of:
  - Tasks and their states
  - Brain dump entries
  - Current brain dump draft
  - Reward points
- Data survives page refreshes

### 6. Task Organization
- Multiple task lists
- Filter tasks by list
- Task modal for detailed editing
- Timestamp tracking for all changes

### 7. Architecture
- Feature-Sliced Design (FSD) architecture
- TypeScript for type safety
- Zustand for state management
- React for UI components
- Modular component structure
- Comprehensive testing setup

## Technical Stack

- **Frontend**: React
- **Language**: TypeScript
- **State Management**: Zustand
- **Storage**: LocalStorage
- **Testing**: Vitest + React Testing Library
- **Styling**: CSS Modules with BEM

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Run tests:
```bash
npm test
```

## How to Run

### Development Mode
1. Install Node.js (v18 or higher) and npm
2. Clone the repository:
```bash
git clone https://github.com/yourusername/gamifiedTodo.git
cd gamifiedTodo
```

3. Install dependencies:
```bash
npm install
```

4. Start development server:
```bash
npm run dev
```
The app will be available at `http://localhost:5173`


## Project Structure

```
src/
├── app/          # Application entry and configuration
├── entities/     # Business entities (tasks, brain dumps)
├── features/     # Complex features and business logic
├── shared/       # Shared UI components and utilities
└── widgets/      # Complex UI components
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - feel free to use this project for your own purposes.
