# MoodSwinger — Facial Expression Detection & Emotion-Based Audio Player

- **Role**: Full-Stack Developer
- **Category**: Computer Vision & Audio Experiment
- **Featured**: No
- **Tech Stack**: React, Node.js, Express, MongoDB, face-api.js, WebRTC
- **Case Study URL**: https://pardeep-shyoran.me/projects/moodswinger
- **Live Demo**: https://moodswinger.vercel.app
- **Source Code**: https://github.com/Pardeep-Shyoran/Moody-Player

## Overview

MoodSwinger is an experimental web application that pairs computer vision with audio streaming. By analyzing facial landmarks via webcam in the browser, the application classifies emotional states—such as happy, neutral, or angry—and automatically queues corresponding playlists.

## Problem

Finding music that matches a listener’s immediate emotional state often requires tedious searching and manual playlist browsing.

## Engineering Approach

Leveraged client-side neural network models via face-api.js to process webcam video streams directly in the browser, ensuring user video frames remain private while automating mood-tailored music selection.

## Key Features

- **In-Browser Facial Analysis**: Analyzes user webcam feed using face-api.js neural network models to identify facial landmarks and emotion scores.
- **Emotion-to-Music Mapping**: Automatically classifies emotional states (Happy, Neutral, Angry, Sad) and queues matching track selections.
- **Privacy-First Architecture**: All computer vision inference executes entirely on the client; video streams are never transmitted to any external server.
- **Interactive Audio Controls**: Full audio playback engine with play, pause, track skip, volume management, and duration tracking.

## Technical Implementation

- **Computer Vision Pipeline**: Utilizes face-api.js tiny-face-detector and emotion recognition models loaded into the client runtime.
- **Media Capture**: WebRTC getUserMedia API capturing consenting webcam input rendered to canvas with landmark detection.
- **Audio Engine**: React state manager coordinating playlist queues, audio buffering, and playhead position.
- **Backend Catalog**: Express server delivering emotion-tagged music collections from MongoDB.

## Engineering Challenges & Solutions

- **Challenge**: Maintaining smooth frame rates during continuous neural network inference
  - **Solution**: Throttled face detection intervals to discrete polling steps rather than every animation frame, significantly reducing CPU usage.
- **Challenge**: Securing user privacy during camera access
  - **Solution**: Strictly contained camera stream processing inside the browser canvas memory with zero server telemetry or frame caching.

## Key Takeaways

- In-browser computer vision models offer immense privacy benefits when video data never leaves the client boundary.
- Inference throttling is essential for preventing thermal throttling and maintaining responsive UI interactions.
