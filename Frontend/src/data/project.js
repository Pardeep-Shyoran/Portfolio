const projectsData = [
  {
    id: 1,
    slug: 'kodrax',
    title: 'KodraX',
    subtitle: 'Real-Time Collaborative Code Editor & Execution Engine',
    shortDescription: 'A real-time collaborative code editor featuring room-based synchronization, secure JWT authentication, and Judge0 code execution.',
    description: 'KodraX is a collaborative development environment that allows developers to create or join private rooms, write and edit code together in real time via Socket.IO, switch between multiple programming languages, and execute programs through Judge0 CE with synchronized output broadcast.',
    role: 'Full-Stack Developer',
    category: 'Collaborative Web Application',
    theme: 'Code',
    accentColor: '#E4E4E7',
    featured: true,
    imageUrl: 'https://ik.imagekit.io/00zfvrear/Portfolio%20Assets/Screenshot_5-5-2026_84031_kodraxlive.vercel.app.jpeg?updatedAt=1777951868866',
    gallery: [
      {
        url: 'https://ik.imagekit.io/00zfvrear/Portfolio%20Assets/Screenshot_5-5-2026_84031_kodraxlive.vercel.app.jpeg?updatedAt=1777951868866',
        caption: 'KodraX multi-language collaborative editor workspace and live compilation panel',
        alt: 'KodraX live editor and execution interface'
      }
    ],
    tags: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.IO', 'Judge0 CE', 'Monaco Editor', 'JWT'],
    demoUrl: 'https://kodraxlive.vercel.app/',
    repoUrl: 'https://github.com/Pardeep-Shyoran/KodraX',
    problem: 'Developers pairing remotely often struggle with bulky screen-sharing latency or complex local development setups when running technical reviews, interviews, or quick code audits.',
    approach: 'Engineered an event-driven client-server model pairing Monaco Editor on a React client with Node.js and Socket.IO on the server. Broadcasted real-time editor deltas and execution outputs while checkpointing code buffers to MongoDB for session resilience.',
    features: [
      {
        title: 'Room-Based Collaboration',
        description: 'Create isolated rooms with custom identifiers or join instantaneously via shareable invite links.'
      },
      {
        title: 'Real-Time Code Synchronization',
        description: 'Live bidirectional buffer synchronization using Socket.IO events for low-latency editing among multiple participants.'
      },
      {
        title: 'Multi-Language Code Compilation',
        description: 'Integrated Judge0 CE compilation API supporting 14+ languages (JavaScript, Python, C++, Java, Rust, Go) with starter templates.'
      },
      {
        title: 'Synchronized Execution Results',
        description: 'Execution status and compiled console output are broadcast in real time to all connected room members.'
      },
      {
        title: 'Persistent Session State',
        description: 'Automatic MongoDB persistence on code modifications, user departures, and socket disconnect events to safeguard ongoing work.'
      },
      {
        title: 'Secure Authentication & Dashboard',
        description: 'JWT-based authentication with access token refresh flow and a user dashboard managing active and past rooms.'
      }
    ],
    technicalDetails: [
      {
        area: 'Frontend Architecture',
        detail: 'Built with React, Vite, and Monaco Editor. Handles language switching, editor state management, clipboard link sharing, and toast notifications.'
      },
      {
        area: 'Real-Time Networking',
        detail: 'Socket.IO event protocol orchestrating room connection handshakes, delta broadcasts, client rosters, and execution status.'
      },
      {
        area: 'Code Compilation API',
        detail: 'Asynchronous submission pipeline connecting to Judge0 CE to execute source code in sandboxed containers and return stdout/stderr.'
      },
      {
        area: 'Data Layer & Persistence',
        detail: 'MongoDB schemas using Mongoose to persist Room models with creator metadata, active code buffers, and language selections.'
      }
    ],
    challenges: [
      {
        challenge: 'Preventing state loss on abrupt socket disconnections',
        solution: 'Implemented immediate database debounced writes on change, paired with fallback state save hooks triggered on socket disconnect and leave events.'
      },
      {
        challenge: 'Synchronizing execution states without duplicate compiler requests',
        solution: 'Designated the executing participant as the initiator while broadcasting loading and completion states to all room peers to prevent redundant API calls.'
      }
    ],
    learnings: [
      'Architecting real-time collaboration requires defensive fallback persistence to mitigate unexpected socket drops.',
      'Decoupling heavy compiler dependencies to an isolated execution sandbox keeps the web application server lightweight and responsive.'
    ]
  },
  {
    id: 2,
    slug: 'rivo',
    title: 'Rivo',
    subtitle: 'Scalable Music Streaming & Artist Management Platform',
    shortDescription: 'A microservices-based music streaming platform featuring role-based access, AWS S3 track storage, and RabbitMQ event messaging.',
    description: 'Rivo is a full-stack audio streaming platform engineered with decoupled microservices. It delivers role-based experiences for artists and listeners, secure audio uploads via AWS S3, asynchronous email notifications using RabbitMQ message queues, and playback history tracking.',
    role: 'Full-Stack Developer',
    category: 'Distributed Audio Platform',
    theme: 'Music',
    accentColor: '#E4E4E7',
    featured: true,
    imageUrl: 'https://ik.imagekit.io/00zfvrear/Portfolio%20Assets/image.png?updatedAt=1777951800968',
    gallery: [
      {
        url: 'https://ik.imagekit.io/00zfvrear/Portfolio%20Assets/image.png?updatedAt=1777951800968',
        caption: 'Rivo web streaming interface showcasing track discovery and audio playback',
        alt: 'Rivo music streaming player and track catalogue interface'
      }
    ],
    tags: ['React', 'Node.js', 'Express', 'MongoDB', 'RabbitMQ', 'AWS S3', 'ImageKit', 'JWT'],
    demoUrl: 'https://rivo-music.vercel.app/',
    repoUrl: 'https://github.com/Pardeep-Shyoran/Rivo',
    problem: 'Audio streaming systems require scalable storage for heavy media, fast catalog indexing for listeners, and decoupled background workers so media uploads and notifications do not block core API responsiveness.',
    approach: 'Structured the platform into decoupled services (Auth, Music, Notification) connected through a RabbitMQ message broker and AWS S3 object storage, paired with an accessible, high-performance React audio interface.',
    features: [
      {
        title: 'Role-Based Access Control',
        description: 'Distinct permission scopes for Artists (track uploads, catalog management) and Listeners (browsing, playback, history).'
      },
      {
        title: 'Cloud Audio Storage Pipeline',
        description: 'Secure track storage utilizing AWS S3 with presigned streaming URLs and cover image processing via ImageKit.'
      },
      {
        title: 'Event-Driven Notification Broker',
        description: 'RabbitMQ message queue handling asynchronous, non-blocking email notifications for user registration and key account events.'
      },
      {
        title: 'Play History & Analytics Tracking',
        description: 'Timestamped playback history tracking with compound MongoDB indexes optimized for recent listening queries.'
      },
      {
        title: 'Persistent Audio Player',
        description: 'Continuous audio playback interface with volume controls, seek bar, queue progression, and track metadata.'
      },
      {
        title: 'User Preferences & Settings',
        description: 'Profile personalization including avatar uploads, notification preferences, audio quality options, and data export.'
      }
    ],
    technicalDetails: [
      {
        area: 'Microservice Decomposition',
        detail: 'Separated Auth, Music, and Notification services into independent Node.js/Express applications communicating via REST and message broker.'
      },
      {
        area: 'Message Queue Integration',
        detail: 'Configured RabbitMQ with connection pooling, automatic reconnection, and max retry limits to ensure resilient message delivery.'
      },
      {
        area: 'Object Storage & Media',
        detail: 'Integrated AWS S3 SDK for audio file storage and Multer/ImageKit for optimized profile and cover image CDN delivery.'
      },
      {
        area: 'Authentication & Session Handling',
        detail: 'Token-based authentication supporting httpOnly cookies and Authorization header fallbacks for cross-domain microservice requests.'
      }
    ],
    challenges: [
      {
        challenge: 'Cross-domain cookie sharing across decoupled microservices on separate subdomains',
        solution: 'Implemented a dual-authentication model using secure httpOnly cookies for primary service requests and Bearer token headers for cross-domain microservice calls.'
      },
      {
        challenge: 'Stale broker connections exhausting CloudAMQP connection quotas',
        solution: 'Engineered a singleton connection manager with proactive heartbeat monitoring, max 3-attempt retries, and graceful process shutdown handlers.'
      }
    ],
    learnings: [
      'Microservice architectures necessitate resilient connection pooling and graceful degradation when auxiliary brokers are unavailable.',
      'Decoupling notification and media pipelines to background queues dramatically improves frontend API response times.'
    ]
  },
  {
    id: 3,
    slug: 'lite-insta',
    title: 'Lite-Insta',
    subtitle: 'Full-Stack Social Media Application with AI Caption Generation',
    shortDescription: 'A MERN social platform featuring photo feeds, JWT session security, and Google Gemini AI caption generation.',
    description: 'Lite-Insta is a modern social media application that allows users to publish photo posts, curate their profiles, and browse community feeds. The application integrates Google GenAI (Gemini) to provide automated, context-aware caption recommendations for uploaded imagery.',
    role: 'Full-Stack Developer',
    category: 'Social Web Application',
    theme: 'Social',
    accentColor: '#E4E4E7',
    featured: true,
    imageUrl: 'https://ik.imagekit.io/00zfvrear/Portfolio%20Assets/Screenshot%202025-10-19%20at%2022.36.59.png?updatedAt=1760893650849',
    gallery: [
      {
        url: 'https://ik.imagekit.io/00zfvrear/Portfolio%20Assets/Screenshot%202025-10-19%20at%2022.36.59.png?updatedAt=1760893650849',
        caption: 'Lite-Insta application feed with responsive media layout and interaction actions',
        alt: 'Lite-Insta social media feed interface'
      }
    ],
    tags: ['React', 'Node.js', 'Express', 'MongoDB', 'Google Gemini API', 'ImageKit', 'JWT', 'Redux Toolkit'],
    demoUrl: 'https://lite-insta.vercel.app/',
    repoUrl: 'https://github.com/Pardeep-Shyoran/Lite-Insta',
    problem: 'Building an engaging photo-sharing experience requires reliable cloud media handling, fast client state management, and creative content authoring tools that reduce friction for users.',
    approach: 'Engineered a full-stack MERN architecture using React 18 and Redux Toolkit for responsive UI state, Express for RESTful CRUD endpoints, ImageKit for CDN asset delivery, and the Google Gemini API for automated caption suggestions.',
    features: [
      {
        title: 'User Authentication & Profiles',
        description: 'Secure registration and login with bcrypt password hashing, JWT token issuance, and editable user profiles.'
      },
      {
        title: 'Complete Post Lifecycle',
        description: 'Full CRUD operations for media posts with image file uploads and cloud asset persistence via ImageKit.'
      },
      {
        title: 'AI-Powered Caption Generator',
        description: 'Integrated Google Gemini API to assist creators with contextually relevant, creative caption suggestions for their photos.'
      },
      {
        title: 'Responsive Feed & Profile Views',
        description: 'Clean feed display adapting fluidly across smartphone, tablet, and desktop viewports.'
      },
      {
        title: 'Global State Management',
        description: 'Centralized Redux Toolkit store managing authentication state, active feeds, and post mutation actions.'
      }
    ],
    technicalDetails: [
      {
        area: 'Frontend State & UI',
        detail: 'React 18 application with Redux Toolkit slices, React Router for protected navigation, and CSS Modules for scoped styling.'
      },
      {
        area: 'AI Integration',
        detail: 'Google GenAI SDK integration executing prompt-driven caption generation with error boundaries and timeouts.'
      },
      {
        area: 'Backend API & Storage',
        detail: 'Express.js server with Multer multipart middleware forwarding post assets to ImageKit CDN.'
      },
      {
        area: 'Data Model',
        detail: 'Mongoose schemas defining User identities and Post records with relational references and timestamps.'
      }
    ],
    challenges: [
      {
        challenge: 'Handling file uploads smoothly without blocking user feedback',
        solution: 'Implemented client-side image previewing and optimistic UI feedback paired with toast notifications during cloud storage processing.'
      },
      {
        challenge: 'Gracefully handling external AI API latency and rate limits',
        solution: 'Structured the caption generation flow as an optional assistant tool with request timeouts so standard post creation remains unblocked.'
      }
    ],
    learnings: [
      'Integrating generative AI into consumer CRUD workflows works best as an augmentative tool that never blocks the core creation path.',
      'Redux Toolkit significantly simplifies synchronized cache invalidation when posts are created, updated, or deleted.'
    ]
  },
  {
    id: 4,
    slug: 'moodswinger',
    title: 'MoodSwinger',
    subtitle: 'Facial Expression Detection & Emotion-Based Audio Player',
    shortDescription: 'An interactive music player utilizing client-side facial expression analysis via face-api.js to play mood-matching audio.',
    description: 'MoodSwinger is an experimental web application that pairs computer vision with audio streaming. By analyzing facial landmarks via webcam in the browser, the application classifies emotional states—such as happy, neutral, or angry—and automatically queues corresponding playlists.',
    role: 'Full-Stack Developer',
    category: 'Computer Vision & Audio Experiment',
    theme: 'Music',
    accentColor: '#E4E4E7',
    featured: false,
    imageUrl: 'https://ik.imagekit.io/00zfvrear/Portfolio%20Assets/Screenshot%202025-10-19%20at%2022.38.57.png?updatedAt=1760893752687',
    gallery: [
      {
        url: 'https://ik.imagekit.io/00zfvrear/Portfolio%20Assets/Screenshot%202025-10-19%20at%2022.38.57.png?updatedAt=1760893752687',
        caption: 'MoodSwinger main music playback interface and track queue',
        alt: 'MoodSwinger music player interface'
      },
      {
        url: 'https://raw.githubusercontent.com/Pardeep-Shyoran/Moody-Player/main/screenshots/happy.jpeg',
        caption: 'Real-time facial detection mapping happy expression to upbeat audio',
        alt: 'MoodSwinger happy emotion detection preview'
      },
      {
        url: 'https://raw.githubusercontent.com/Pardeep-Shyoran/Moody-Player/main/screenshots/neutral.jpeg',
        caption: 'Real-time facial detection mapping neutral expression to balanced audio',
        alt: 'MoodSwinger neutral emotion detection preview'
      }
    ],
    tags: ['React', 'Node.js', 'Express', 'MongoDB', 'face-api.js', 'WebRTC'],
    demoUrl: 'https://moodswinger.vercel.app',
    repoUrl: 'https://github.com/Pardeep-Shyoran/Moody-Player',
    problem: 'Finding music that matches a listener’s immediate emotional state often requires tedious searching and manual playlist browsing.',
    approach: 'Leveraged client-side neural network models via face-api.js to process webcam video streams directly in the browser, ensuring user video frames remain private while automating mood-tailored music selection.',
    features: [
      {
        title: 'In-Browser Facial Analysis',
        description: 'Analyzes user webcam feed using face-api.js neural network models to identify facial landmarks and emotion scores.'
      },
      {
        title: 'Emotion-to-Music Mapping',
        description: 'Automatically classifies emotional states (Happy, Neutral, Angry, Sad) and queues matching track selections.'
      },
      {
        title: 'Privacy-First Architecture',
        description: 'All computer vision inference executes entirely on the client; video streams are never transmitted to any external server.'
      },
      {
        title: 'Interactive Audio Controls',
        description: 'Full audio playback engine with play, pause, track skip, volume management, and duration tracking.'
      }
    ],
    technicalDetails: [
      {
        area: 'Computer Vision Pipeline',
        detail: 'Utilizes face-api.js tiny-face-detector and emotion recognition models loaded into the client runtime.'
      },
      {
        area: 'Media Capture',
        detail: 'WebRTC getUserMedia API capturing consenting webcam input rendered to canvas with landmark detection.'
      },
      {
        area: 'Audio Engine',
        detail: 'React state manager coordinating playlist queues, audio buffering, and playhead position.'
      },
      {
        area: 'Backend Catalog',
        detail: 'Express server delivering emotion-tagged music collections from MongoDB.'
      }
    ],
    challenges: [
      {
        challenge: 'Maintaining smooth frame rates during continuous neural network inference',
        solution: 'Throttled face detection intervals to discrete polling steps rather than every animation frame, significantly reducing CPU usage.'
      },
      {
        challenge: 'Securing user privacy during camera access',
        solution: 'Strictly contained camera stream processing inside the browser canvas memory with zero server telemetry or frame caching.'
      }
    ],
    learnings: [
      'In-browser computer vision models offer immense privacy benefits when video data never leaves the client boundary.',
      'Inference throttling is essential for preventing thermal throttling and maintaining responsive UI interactions.'
    ]
  },
  {
    id: 5,
    slug: 'fokus',
    title: 'FOKUS',
    subtitle: 'Commercial Product Landing Page & Interactive Catalog',
    shortDescription: 'A responsive energy drink product showcase built with React, modular CSS, and dynamic JSON Server catalog feeds.',
    description: 'FOKUS is an editorial e-commerce product landing page developed for an energy drink brand. Built with a component-driven React architecture and scoped CSS Modules, it showcases product variants, dynamic nutrition specifications, and promotional brand content.',
    role: 'Frontend Developer',
    category: 'E-Commerce Showcase',
    theme: 'Commerce',
    accentColor: '#E4E4E7',
    featured: false,
    imageUrl: 'https://ik.imagekit.io/00zfvrear/Portfolio%20Assets/Screenshot%202025-10-19%20at%2022.39.54.png?updatedAt=1760893814665',
    gallery: [
      {
        url: 'https://ik.imagekit.io/00zfvrear/Portfolio%20Assets/Screenshot%202025-10-19%20at%2022.39.54.png?updatedAt=1760893814665',
        caption: 'FOKUS product landing page hero and dynamic brand catalog',
        alt: 'FOKUS energy drink landing page presentation'
      }
    ],
    tags: ['React', 'Modular CSS', 'JSON Server', 'JavaScript', 'REST API'],
    demoUrl: 'https://fokus-shop.vercel.app/',
    repoUrl: 'https://github.com/Pardeep-Shyoran/Hackathon-Project',
    problem: 'Product brand launches need high-converting, lightning-fast landing experiences that balance bold editorial design with dynamic data management without bloated dependencies.',
    approach: 'Constructed a modular React application styled with CSS Modules for zero style leakage, decoupling product data into a mock REST service via JSON Server for agile iteration.',
    features: [
      {
        title: 'Editorial Product Presentation',
        description: 'High-impact typography and visual hierarchy tailored for commercial brand storytelling.'
      },
      {
        title: 'Dynamic Product Catalog',
        description: 'Asynchronous catalog retrieval fetching product variants, flavors, and nutritional specifications.'
      },
      {
        title: 'Responsive Grid Layout',
        description: 'Fluid layout structures adapting gracefully from mobile screens to desktop widescreen monitors.'
      },
      {
        title: 'Interactive Flavor Navigation',
        description: 'Dynamic flavor and spec selectors updating visual assets and ingredient details on user interaction.'
      }
    ],
    technicalDetails: [
      {
        area: 'Component Styling',
        detail: 'Modular CSS architecture providing isolated styling rules and zero runtime CSS overhead.'
      },
      {
        area: 'Data Ingestion',
        detail: 'RESTful fetching communicating with a JSON Server backend to populate catalog products and specifications.'
      },
      {
        area: 'Responsive Mechanics',
        detail: 'Fluid viewport units and CSS grid patterns maintaining layout proportionality across resolutions.'
      }
    ],
    challenges: [
      {
        challenge: 'Maintaining sharp visual proportions across varied viewport sizes',
        solution: 'Implemented clamp-based fluid spacing and typography scales to ensure brand aesthetics remain balanced across mobile and desktop.'
      }
    ],
    learnings: [
      'CSS Modules offer an ideal balance of performance, isolation, and predictability for branding-focused landing pages.',
      'Decoupling data contracts from view components speeds up frontend iteration cycles during hackathons and fast builds.'
    ]
  },
  {
    id: 6,
    slug: 'windows-11',
    title: 'Windows 11 Web Clone',
    subtitle: 'Framework-Free Browser OS Desktop Simulation',
    shortDescription: 'A functional browser-based Windows 11 desktop experience built purely with Vanilla JavaScript, HTML5, and CSS3.',
    description: 'An architectural exploration of the Windows 11 operating system interface built entirely in the browser using vanilla web standards. It replicates desktop window management, an interactive taskbar, start menu, functional Notepad, file explorer simulation, and theme toggling without any external libraries.',
    role: 'Frontend Developer',
    category: 'Frontend Engineering Simulation',
    theme: 'Web',
    accentColor: '#E4E4E7',
    featured: false,
    imageUrl: 'https://ik.imagekit.io/00zfvrear/Portfolio%20Assets/Screenshot%202025-10-19%20at%2022.41.18.png?updatedAt=1760893908876',
    gallery: [
      {
        url: 'https://ik.imagekit.io/00zfvrear/Portfolio%20Assets/Screenshot%202025-10-19%20at%2022.41.18.png?updatedAt=1760893908876',
        caption: 'Windows 11 browser simulation desktop and centered taskbar',
        alt: 'Windows 11 browser simulation desktop view'
      },
      {
        url: 'https://raw.githubusercontent.com/Pardeep-Shyoran/Windows-11/main/Project-img/img1.png',
        caption: 'Desktop interface with custom context menu and file management',
        alt: 'Windows 11 desktop context menu and icons'
      },
      {
        url: 'https://raw.githubusercontent.com/Pardeep-Shyoran/Windows-11/main/Project-img/img5.png',
        caption: 'Simulated system applications and taskbar window controls',
        alt: 'Windows 11 system applications preview'
      }
    ],
    tags: ['HTML5', 'CSS3', 'Vanilla JavaScript', 'DOM Manipulation', 'Event Architecture'],
    demoUrl: 'https://os-windows-11.vercel.app/',
    repoUrl: 'https://github.com/Pardeep-Shyoran/Windows-11',
    problem: 'Gaining a deep, ground-level understanding of how complex desktop UI frameworks manage z-indexing, window hierarchies, event bubbling, and coordinate math without relying on abstractions.',
    approach: 'Architected an event-driven vanilla JavaScript codebase with modular controllers managing DOM nodes, pointer coordinates for window drag-and-drop, and contextual event listeners.',
    features: [
      {
        title: 'Desktop Environment & Icons',
        description: 'Interactive virtual desktop supporting file and folder creation, renaming, and removal.'
      },
      {
        title: 'Window Management Engine',
        description: 'Draggable, minimizable, maximizable, and closable application windows with coordinate boundaries.'
      },
      {
        title: 'Windows 11 Taskbar & Launcher',
        description: 'Faithfully centered taskbar icons, active app markers, and start menu search launcher.'
      },
      {
        title: 'Functional Built-in Applications',
        description: 'Working Notepad text editor, Calculator utility, and simulated File Explorer browser.'
      },
      {
        title: 'Context Menus & Theming',
        description: 'Custom right-click contextual menus and wallpaper customization options.'
      }
    ],
    technicalDetails: [
      {
        area: 'DOM & Event Architecture',
        detail: 'Vanilla ES6+ JavaScript modules utilizing event delegation and coordinate tracking.'
      },
      {
        area: 'Window Hierarchy',
        detail: 'Z-index coordinator elevating active windows on pointer interaction and syncing taskbar state.'
      },
      {
        area: 'Persistence',
        detail: 'Browser localStorage integration preserving user desktop notes and active wallpaper preferences.'
      }
    ],
    challenges: [
      {
        challenge: 'Coordinating drag-and-drop window movement without visual jitter or overflow',
        solution: 'Calculated mouse movement delta offsets against viewport boundaries and bound drag handlers to document-level listeners.'
      },
      {
        challenge: 'Managing contextual menu dismissal',
        solution: 'Implemented document-wide click listeners that cleanly dismiss open menus when clicking outside active boundary elements.'
      }
    ],
    learnings: [
      'Building complex interfaces without frameworks offers invaluable insight into browser paint cycles, DOM mutations, and event delegation.',
      'Math-driven coordinate tracking requires careful event listener cleanup to prevent memory leaks and cursor desynchronization.'
    ]
  },
  {
    id: 7,
    slug: 'github-profile-search',
    title: 'GitHub Profile Search',
    subtitle: 'Developer Analytics & Public Profile Explorer',
    shortDescription: 'A responsive developer lookup tool interfacing with the GitHub REST API to render user metrics, repositories, and activity.',
    description: 'A developer search application that interacts with the GitHub REST API to query and present developer profiles, public repositories, follower counts, and organizational metadata in a focused, high-contrast interface.',
    role: 'Frontend Developer',
    category: 'Developer Tools & API Integration',
    theme: 'Web',
    accentColor: '#E4E4E7',
    featured: false,
    imageUrl: 'https://ik.imagekit.io/00zfvrear/Portfolio%20Assets/Screenshot%202025-10-19%20at%2022.42.49.png?updatedAt=1760893985410',
    gallery: [
      {
        url: 'https://ik.imagekit.io/00zfvrear/Portfolio%20Assets/Screenshot%202025-10-19%20at%2022.42.49.png?updatedAt=1760893985410',
        caption: 'GitHub Profile Search query interface and metrics dashboard',
        alt: 'GitHub Profile Search developer analytics interface'
      }
    ],
    tags: ['HTML5', 'CSS3', 'JavaScript', 'GitHub REST API', 'Async/Await'],
    demoUrl: 'https://pardeep-shyoran.github.io/Github-Profile-Search/',
    repoUrl: 'https://github.com/Pardeep-Shyoran/Github-Profile-Search',
    problem: 'Quickly inspecting a developer’s public GitHub portfolio, star counts, and top repositories without navigating through multiple GitHub profile pages.',
    approach: 'Engineered a lightweight, zero-dependency search application using modern asynchronous JavaScript to interface with the GitHub REST API with graceful error and rate-limit handling.',
    features: [
      {
        title: 'Real-Time Developer Lookups',
        description: 'Asynchronous username querying against the official GitHub REST API with instant data formatting.'
      },
      {
        title: 'Repository Showcase',
        description: 'Formatted cards displaying public repositories with star ratings, fork metrics, and direct links.'
      },
      {
        title: 'Key Metrics Breakdown',
        description: 'Clear statistical presentation of total public repos, followers, following, and biography details.'
      },
      {
        title: 'Contextual Error Handling',
        description: 'Helpful feedback states for non-existent usernames, network interruptions, and API rate limits.'
      }
    ],
    technicalDetails: [
      {
        area: 'API Integration',
        detail: 'Native fetch with async/await handling status code parsing (200, 404, 403) and JSON extraction.'
      },
      {
        area: 'DOM Rendering',
        detail: 'Modular JavaScript generating semantic HTML elements and injecting validated API values.'
      },
      {
        area: 'Responsive Layout',
        detail: 'CSS Flexbox and Grid structure adapting to smartphone, tablet, and desktop display widths.'
      }
    ],
    challenges: [
      {
        challenge: 'Handling unauthenticated GitHub API rate limits (60 queries/hour)',
        solution: 'Detected 403 status codes and presented informative notification banners alerting users to rate limits.'
      }
    ],
    learnings: [
      'Defensive error handling and status code checking are critical when interfacing with third-party public APIs.',
      'Lean, framework-free web tools offer near-zero loading times and exceptional performance.'
    ]
  }
];

export default projectsData;