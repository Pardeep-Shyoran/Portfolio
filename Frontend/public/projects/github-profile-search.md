# GitHub Profile Search — Developer Analytics & Public Profile Explorer

- **Role**: Frontend Developer
- **Category**: Developer Tools & API Integration
- **Featured**: No
- **Tech Stack**: HTML5, CSS3, JavaScript, GitHub REST API, Async/Await
- **Case Study URL**: https://pardeep-shyoran.me/projects/github-profile-search
- **Live Demo**: https://pardeep-shyoran.github.io/Github-Profile-Search/
- **Source Code**: https://github.com/Pardeep-Shyoran/Github-Profile-Search

## Overview

A developer search application that interacts with the GitHub REST API to query and present developer profiles, public repositories, follower counts, and organizational metadata in a focused, high-contrast interface.

## Problem

Quickly inspecting a developer’s public GitHub portfolio, star counts, and top repositories without navigating through multiple GitHub profile pages.

## Engineering Approach

Engineered a lightweight, zero-dependency search application using modern asynchronous JavaScript to interface with the GitHub REST API with graceful error and rate-limit handling.

## Key Features

- **Real-Time Developer Lookups**: Asynchronous username querying against the official GitHub REST API with instant data formatting.
- **Repository Showcase**: Formatted cards displaying public repositories with star ratings, fork metrics, and direct links.
- **Key Metrics Breakdown**: Clear statistical presentation of total public repos, followers, following, and biography details.
- **Contextual Error Handling**: Helpful feedback states for non-existent usernames, network interruptions, and API rate limits.

## Technical Implementation

- **API Integration**: Native fetch with async/await handling status code parsing (200, 404, 403) and JSON extraction.
- **DOM Rendering**: Modular JavaScript generating semantic HTML elements and injecting validated API values.
- **Responsive Layout**: CSS Flexbox and Grid structure adapting to smartphone, tablet, and desktop display widths.

## Engineering Challenges & Solutions

- **Challenge**: Handling unauthenticated GitHub API rate limits (60 queries/hour)
  - **Solution**: Detected 403 status codes and presented informative notification banners alerting users to rate limits.

## Key Takeaways

- Defensive error handling and status code checking are critical when interfacing with third-party public APIs.
- Lean, framework-free web tools offer near-zero loading times and exceptional performance.
