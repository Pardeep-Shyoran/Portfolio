# Rivo — Scalable Music Streaming & Artist Management Platform

- **Role**: Full-Stack Developer
- **Category**: Distributed Audio Platform
- **Featured**: Yes
- **Tech Stack**: React, Node.js, Express, MongoDB, RabbitMQ, AWS S3, ImageKit, JWT
- **Case Study URL**: https://pardeep-shyoran.me/projects/rivo
- **Live Demo**: https://rivo-music.vercel.app/
- **Source Code**: https://github.com/Pardeep-Shyoran/Rivo

## Overview

Rivo is a full-stack audio streaming platform engineered with decoupled microservices. It delivers role-based experiences for artists and listeners, secure audio uploads via AWS S3, asynchronous email notifications using RabbitMQ message queues, and playback history tracking.

## Problem

Audio streaming systems require scalable storage for heavy media, fast catalog indexing for listeners, and decoupled background workers so media uploads and notifications do not block core API responsiveness.

## Engineering Approach

Structured the platform into decoupled services (Auth, Music, Notification) connected through a RabbitMQ message broker and AWS S3 object storage, paired with an accessible, high-performance React audio interface.

## Key Features

- **Role-Based Access Control**: Distinct permission scopes for Artists (track uploads, catalog management) and Listeners (browsing, playback, history).
- **Cloud Audio Storage Pipeline**: Secure track storage utilizing AWS S3 with presigned streaming URLs and cover image processing via ImageKit.
- **Event-Driven Notification Broker**: RabbitMQ message queue handling asynchronous, non-blocking email notifications for user registration and key account events.
- **Play History & Analytics Tracking**: Timestamped playback history tracking with compound MongoDB indexes optimized for recent listening queries.
- **Persistent Audio Player**: Continuous audio playback interface with volume controls, seek bar, queue progression, and track metadata.
- **User Preferences & Settings**: Profile personalization including avatar uploads, notification preferences, audio quality options, and data export.

## Technical Implementation

- **Microservice Decomposition**: Separated Auth, Music, and Notification services into independent Node.js/Express applications communicating via REST and message broker.
- **Message Queue Integration**: Configured RabbitMQ with connection pooling, automatic reconnection, and max retry limits to ensure resilient message delivery.
- **Object Storage & Media**: Integrated AWS S3 SDK for audio file storage and Multer/ImageKit for optimized profile and cover image CDN delivery.
- **Authentication & Session Handling**: Token-based authentication supporting httpOnly cookies and Authorization header fallbacks for cross-domain microservice requests.

## Engineering Challenges & Solutions

- **Challenge**: Cross-domain cookie sharing across decoupled microservices on separate subdomains
  - **Solution**: Implemented a dual-authentication model using secure httpOnly cookies for primary service requests and Bearer token headers for cross-domain microservice calls.
- **Challenge**: Stale broker connections exhausting CloudAMQP connection quotas
  - **Solution**: Engineered a singleton connection manager with proactive heartbeat monitoring, max 3-attempt retries, and graceful process shutdown handlers.

## Key Takeaways

- Microservice architectures necessitate resilient connection pooling and graceful degradation when auxiliary brokers are unavailable.
- Decoupling notification and media pipelines to background queues dramatically improves frontend API response times.
