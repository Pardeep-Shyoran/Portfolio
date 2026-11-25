# FOKUS — Commercial Product Landing Page & Interactive Catalog

- **Role**: Frontend Developer
- **Category**: E-Commerce Showcase
- **Featured**: No
- **Tech Stack**: React, Modular CSS, JSON Server, JavaScript, REST API
- **Case Study URL**: https://pardeep-shyoran.me/projects/fokus
- **Live Demo**: https://fokus-shop.vercel.app/
- **Source Code**: https://github.com/Pardeep-Shyoran/Hackathon-Project

## Overview

FOKUS is an editorial e-commerce product landing page developed for an energy drink brand. Built with a component-driven React architecture and scoped CSS Modules, it showcases product variants, dynamic nutrition specifications, and promotional brand content.

## Problem

Product brand launches need high-converting, lightning-fast landing experiences that balance bold editorial design with dynamic data management without bloated dependencies.

## Engineering Approach

Constructed a modular React application styled with CSS Modules for zero style leakage, decoupling product data into a mock REST service via JSON Server for agile iteration.

## Key Features

- **Editorial Product Presentation**: High-impact typography and visual hierarchy tailored for commercial brand storytelling.
- **Dynamic Product Catalog**: Asynchronous catalog retrieval fetching product variants, flavors, and nutritional specifications.
- **Responsive Grid Layout**: Fluid layout structures adapting gracefully from mobile screens to desktop widescreen monitors.
- **Interactive Flavor Navigation**: Dynamic flavor and spec selectors updating visual assets and ingredient details on user interaction.

## Technical Implementation

- **Component Styling**: Modular CSS architecture providing isolated styling rules and zero runtime CSS overhead.
- **Data Ingestion**: RESTful fetching communicating with a JSON Server backend to populate catalog products and specifications.
- **Responsive Mechanics**: Fluid viewport units and CSS grid patterns maintaining layout proportionality across resolutions.

## Engineering Challenges & Solutions

- **Challenge**: Maintaining sharp visual proportions across varied viewport sizes
  - **Solution**: Implemented clamp-based fluid spacing and typography scales to ensure brand aesthetics remain balanced across mobile and desktop.

## Key Takeaways

- CSS Modules offer an ideal balance of performance, isolation, and predictability for branding-focused landing pages.
- Decoupling data contracts from view components speeds up frontend iteration cycles during hackathons and fast builds.
