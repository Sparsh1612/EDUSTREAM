# EduStream Frontend

React + Tailwind CSS frontend for the EduStream adaptive streaming platform with offline support.

## 📁 Project Structure

```
src/
├── index.tsx              # React entry point
├── App.tsx                # Root application component
├── components/            # Reusable components
│   ├── Player/           # HLS video player
│   ├── Header/           # Navigation header
│   ├── Sidebar/          # Navigation sidebar
│   └── ...
├── pages/                # Page components
│   ├── Dashboard.tsx
│   ├── VideoWatch.tsx
│   ├── Upload.tsx
│   └── ...
├── services/             # API client & external services
│   ├── api.ts           # Axios instance & endpoints
│   ├── auth.ts          # Authentication service
│   ├── video.ts         # Video service
│   └── ...
├── hooks/               # Custom React hooks
│   ├── useAuth.ts
│   ├── useVideo.ts
│   └── ...
├── store/               # State management (Zustand)
│   ├── authStore.ts
│   ├── videoStore.ts
│   └── ...
├── types/               # TypeScript interfaces
│   ├── api.types.ts
│   ├── user.types.ts
│   └── ...
├── utils/               # Utility functions
│   ├── formatting.ts
│   ├── storage.ts
│   └── ...
└── styles/
    ├── index.css
    └── tailwind.config.js
```

## 🚀 Getting Started

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm start
```

Server runs on `http://localhost:3001`

### Build for Production
```bash
npm run build
```

### Run Tests
```bash
npm run test
npm run test:coverage
```

## 🎬 Features

### HLS Video Player
- Adaptive bitrate streaming
- Quality selector UI
- Playback controls
- Buffering indicators
- Real-time bandwidth display

### Authentication
- User registration & login
- Token refresh mechanism
- Protected routes

### Content Management
- Video library/dashboard
- Course organization
- Upload interface
- Metadata editing

### Offline Support (PWA)
- Service worker for offline caching
- Sync queue for offline actions
- Cache invalidation strategy

## 🛠️ Configuration

Environment variables in `.env`:
```
REACT_APP_API_BASE_URL=http://localhost:3000/api
REACT_APP_WS_URL=ws://localhost:3000/ws
```

## 📦 Dependencies

- **React 18**: UI framework
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **HLS.js**: Adaptive streaming player
- **Tailwind CSS**: Utility-first CSS
- **Zustand**: Lightweight state management
- **Heroicons**: Icon library

## 🔐 Security

- JWT token stored in secure HTTP-only cookie (in production)
- CSRF protection via headers
- XSS prevention through React's built-in escaping
- Secure password handling

## 🧪 Testing

```bash
# Unit tests
npm run test

# Coverage report
npm run test:coverage

# Type checking
npm run type-check
```

## 📱 Responsive Design

- Mobile-first approach
- Tailwind breakpoints: `sm`, `md`, `lg`, `xl`, `2xl`
- Touch-friendly controls
- Viewport optimization for low-bandwidth

## ♿ Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Video player accessibility (captions, transcripts planned)

## 🌐 PWA Support

- Service Worker for offline caching
- Web App Manifest
- Install prompts
- Offline page fallback

## 🚢 Deployment

See root `README.md` for deployment to Docker/Kubernetes.

## 📚 API Integration

API client with automatic:
- Request interceptors (auth headers)
- Response interceptors (error handling)
- Retry logic for failed requests
- Rate limit awareness

Example:
```typescript
import { api } from '@services/api';

// GET with auth
const videos = await api.get('/videos');

// POST with auth
const response = await api.post('/videos', videoData);

// Error handling
try {
  await api.post('/auth/login', credentials);
} catch (error) {
  // Automatically refreshes token on 401
}
```

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes following code style
3. Test thoroughly: `npm run test`
4. Commit: `git commit -m 'Add feature'`
5. Push: `git push origin feature/your-feature`

---

**Built with ❤️ for educators and students.**
