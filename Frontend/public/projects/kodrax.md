# KodraX — Real-Time Collaborative Code Editor & Execution Engine

- **Role**: Full-Stack Developer
- **Category**: Collaborative Web Application
- **Featured**: Yes
- **Tech Stack**: React, Node.js, Express, MongoDB, Socket.IO, Judge0 CE, Monaco Editor, JWT
- **Case Study URL**: https://pardeep-shyoran.me/projects/kodrax
- **Live Demo**: https://kodraxlive.vercel.app/
- **Source Code**: https://github.com/Pardeep-Shyoran/KodraX

## Overview

KodraX is a collaborative development environment that allows developers to create or join private rooms, write and edit code together in real time via Socket.IO, switch between multiple programming languages, and execute programs through Judge0 CE with synchronized output broadcast.

## Problem

Developers pairing remotely often struggle with bulky screen-sharing latency or complex local development setups when running technical reviews, interviews, or quick code audits.

## Engineering Approach

Engineered an event-driven client-server model pairing Monaco Editor on a React client with Node.js and Socket.IO on the server. Broadcasted real-time editor deltas and execution outputs while checkpointing code buffers to MongoDB for session resilience.

## Key Features

- **Room-Based Collaboration**: Create isolated rooms with custom identifiers or join instantaneously via shareable invite links.
- **Real-Time Code Synchronization**: Live bidirectional buffer synchronization using Socket.IO events for low-latency editing among multiple participants.
- **Multi-Language Code Compilation**: Integrated Judge0 CE compilation API supporting 14+ languages (JavaScript, Python, C++, Java, Rust, Go) with starter templates.
- **Synchronized Execution Results**: Execution status and compiled console output are broadcast in real time to all connected room members.
- **Persistent Session State**: Automatic MongoDB persistence on code modifications, user departures, and socket disconnect events to safeguard ongoing work.
- **Secure Authentication & Dashboard**: JWT-based authentication with access token refresh flow and a user dashboard managing active and past rooms.

## Technical Implementation

- **Frontend Architecture**: Built with React, Vite, and Monaco Editor. Handles language switching, editor state management, clipboard link sharing, and toast notifications.
- **Real-Time Networking**: Socket.IO event protocol orchestrating room connection handshakes, delta broadcasts, client rosters, and execution status.
- **Code Compilation API**: Asynchronous submission pipeline connecting to Judge0 CE to execute source code in sandboxed containers and return stdout/stderr.
- **Data Layer & Persistence**: MongoDB schemas using Mongoose to persist Room models with creator metadata, active code buffers, and language selections.

## Engineering Challenges & Solutions

- **Challenge**: Preventing state loss on abrupt socket disconnections
  - **Solution**: Implemented immediate database debounced writes on change, paired with fallback state save hooks triggered on socket disconnect and leave events.
- **Challenge**: Synchronizing execution states without duplicate compiler requests
  - **Solution**: Designated the executing participant as the initiator while broadcasting loading and completion states to all room peers to prevent redundant API calls.

## Key Takeaways

- Architecting real-time collaboration requires defensive fallback persistence to mitigate unexpected socket drops.
- Decoupling heavy compiler dependencies to an isolated execution sandbox keeps the web application server lightweight and responsive.
