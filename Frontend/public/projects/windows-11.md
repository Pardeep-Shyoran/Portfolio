# Windows 11 Web Clone — Framework-Free Browser OS Desktop Simulation

- **Role**: Frontend Developer
- **Category**: Frontend Engineering Simulation
- **Featured**: No
- **Tech Stack**: HTML5, CSS3, Vanilla JavaScript, DOM Manipulation, Event Architecture
- **Case Study URL**: https://pardeep-shyoran.me/projects/windows-11
- **Live Demo**: https://os-windows-11.vercel.app/
- **Source Code**: https://github.com/Pardeep-Shyoran/Windows-11

## Overview

An architectural exploration of the Windows 11 operating system interface built entirely in the browser using vanilla web standards. It replicates desktop window management, an interactive taskbar, start menu, functional Notepad, file explorer simulation, and theme toggling without any external libraries.

## Problem

Gaining a deep, ground-level understanding of how complex desktop UI frameworks manage z-indexing, window hierarchies, event bubbling, and coordinate math without relying on abstractions.

## Engineering Approach

Architected an event-driven vanilla JavaScript codebase with modular controllers managing DOM nodes, pointer coordinates for window drag-and-drop, and contextual event listeners.

## Key Features

- **Desktop Environment & Icons**: Interactive virtual desktop supporting file and folder creation, renaming, and removal.
- **Window Management Engine**: Draggable, minimizable, maximizable, and closable application windows with coordinate boundaries.
- **Windows 11 Taskbar & Launcher**: Faithfully centered taskbar icons, active app markers, and start menu search launcher.
- **Functional Built-in Applications**: Working Notepad text editor, Calculator utility, and simulated File Explorer browser.
- **Context Menus & Theming**: Custom right-click contextual menus and wallpaper customization options.

## Technical Implementation

- **DOM & Event Architecture**: Vanilla ES6+ JavaScript modules utilizing event delegation and coordinate tracking.
- **Window Hierarchy**: Z-index coordinator elevating active windows on pointer interaction and syncing taskbar state.
- **Persistence**: Browser localStorage integration preserving user desktop notes and active wallpaper preferences.

## Engineering Challenges & Solutions

- **Challenge**: Coordinating drag-and-drop window movement without visual jitter or overflow
  - **Solution**: Calculated mouse movement delta offsets against viewport boundaries and bound drag handlers to document-level listeners.
- **Challenge**: Managing contextual menu dismissal
  - **Solution**: Implemented document-wide click listeners that cleanly dismiss open menus when clicking outside active boundary elements.

## Key Takeaways

- Building complex interfaces without frameworks offers invaluable insight into browser paint cycles, DOM mutations, and event delegation.
- Math-driven coordinate tracking requires careful event listener cleanup to prevent memory leaks and cursor desynchronization.
