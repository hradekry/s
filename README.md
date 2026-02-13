# Routine OS

A minimalist mobile-first Progressive Web App (PWA) for daily routine management.

## Features

- **Mobile-First Design**: Optimized for touch interactions and mobile viewing
- **Dark Theme**: Minimalist aesthetic with deep charcoal/black background and purple accents
- **Timeline View**: Scrollable vertical timeline for today's events and tasks
- **Event Types**: Support for one-time events and daily recurring tasks
- **PWA Ready**: Installable on mobile devices with offline capabilities
- **Plugin Architecture**: Extensible core with plugin system for additional features

## Tech Stack

- **React 18** with Vite for fast development
- **Tailwind CSS** for styling with custom dark theme
- **Lucide Icons** for consistent iconography
- **PWA** with service worker for mobile installation

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── core/                 # Core application logic
│   ├── eventStore.js     # Event data management
│   └── pluginSystem.js   # Plugin architecture
├── plugins/              # Extensible plugins
│   └── examplePlugin.js  # Example plugin
├── components/           # React components
│   ├── Header.jsx
│   ├── Timeline.jsx
│   ├── TimelineItem.jsx
│   └── AddEventModal.jsx
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── App.jsx              # Main application component
├── main.jsx             # Application entry point
└── index.css            # Global styles with Tailwind
```

## Plugin Development

Create plugins in the `src/plugins/` directory. Each plugin should export an object with:

```javascript
const myPlugin = {
  name: 'My Plugin',
  version: '1.0.0',
  description: 'Plugin description',
  
  hooks: {
    beforeEventAdd: async (eventData) => { /* ... */ },
    afterEventAdd: async (event) => { /* ... */ },
    beforeEventRemove: async (eventId) => { /* ... */ },
    afterEventRemove: async (eventId) => { /* ... */ },
    renderTimelineItem: async (itemData) => { /* ... */ },
    renderHeader: async (headerData) => { /* ... */ }
  },
  
  init: () => { /* Initialization logic */ },
  destroy: () => { /* Cleanup logic */ }
};
```

## Design System

- **Colors**: Deep black (#000000) background, charcoal (#0a0a0a) cards, purple (#a855f7) accents
- **Typography**: System fonts for optimal performance
- **Spacing**: Tailwind's spacing system with custom extensions
- **Borders**: 1px purple lines for visual hierarchy
- **Touch Targets**: Minimum 44px for mobile accessibility

## PWA Features

- Installable on mobile devices
- Offline functionality
- Mobile-optimized viewport
- Custom app icons and splash screen

## License

MIT
