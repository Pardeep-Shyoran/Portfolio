# Lite-Insta — Full-Stack Social Media Application with AI Caption Generation

- **Role**: Full-Stack Developer
- **Category**: Social Web Application
- **Featured**: Yes
- **Tech Stack**: React, Node.js, Express, MongoDB, Google Gemini API, ImageKit, JWT, Redux Toolkit
- **Case Study URL**: https://pardeep-shyoran.me/projects/lite-insta
- **Live Demo**: https://lite-insta.vercel.app/
- **Source Code**: https://github.com/Pardeep-Shyoran/Lite-Insta

## Overview

Lite-Insta is a modern social media application that allows users to publish photo posts, curate their profiles, and browse community feeds. The application integrates Google GenAI (Gemini) to provide automated, context-aware caption recommendations for uploaded imagery.

## Problem

Building an engaging photo-sharing experience requires reliable cloud media handling, fast client state management, and creative content authoring tools that reduce friction for users.

## Engineering Approach

Engineered a full-stack MERN architecture using React 18 and Redux Toolkit for responsive UI state, Express for RESTful CRUD endpoints, ImageKit for CDN asset delivery, and the Google Gemini API for automated caption suggestions.

## Key Features

- **User Authentication & Profiles**: Secure registration and login with bcrypt password hashing, JWT token issuance, and editable user profiles.
- **Complete Post Lifecycle**: Full CRUD operations for media posts with image file uploads and cloud asset persistence via ImageKit.
- **AI-Powered Caption Generator**: Integrated Google Gemini API to assist creators with contextually relevant, creative caption suggestions for their photos.
- **Responsive Feed & Profile Views**: Clean feed display adapting fluidly across smartphone, tablet, and desktop viewports.
- **Global State Management**: Centralized Redux Toolkit store managing authentication state, active feeds, and post mutation actions.

## Technical Implementation

- **Frontend State & UI**: React 18 application with Redux Toolkit slices, React Router for protected navigation, and CSS Modules for scoped styling.
- **AI Integration**: Google GenAI SDK integration executing prompt-driven caption generation with error boundaries and timeouts.
- **Backend API & Storage**: Express.js server with Multer multipart middleware forwarding post assets to ImageKit CDN.
- **Data Model**: Mongoose schemas defining User identities and Post records with relational references and timestamps.

## Engineering Challenges & Solutions

- **Challenge**: Handling file uploads smoothly without blocking user feedback
  - **Solution**: Implemented client-side image previewing and optimistic UI feedback paired with toast notifications during cloud storage processing.
- **Challenge**: Gracefully handling external AI API latency and rate limits
  - **Solution**: Structured the caption generation flow as an optional assistant tool with request timeouts so standard post creation remains unblocked.

## Key Takeaways

- Integrating generative AI into consumer CRUD workflows works best as an augmentative tool that never blocks the core creation path.
- Redux Toolkit significantly simplifies synchronized cache invalidation when posts are created, updated, or deleted.
