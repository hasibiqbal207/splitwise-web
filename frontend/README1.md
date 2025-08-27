# Splitwise Frontend

The frontend application for Splitwise built with React, Vite, and modern web technologies.

## Technology Stack

- React 18
- Vite
- React Router for navigation
- Modern JavaScript (ES6+)
- CSS Modules for styling
- Axios for API communication

## Project Structure

```
frontend/
├── src/
│   ├── api/          # API integration and service calls
│   ├── components/   # Reusable React components
│   ├── config/       # Application configuration
│   ├── services/     # Business logic and data processing
│   ├── theme/        # UI theme and styling constants
│   ├── utils/        # Utility functions and helpers
│   ├── App.jsx       # Root application component
│   ├── AppRoutes.jsx # Application routing configuration
│   └── main.jsx      # Application entry point
├── public/           # Static assets
├── docker/          # Docker configuration files
└── vite.config.js   # Vite configuration
```

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The application will be available at http://localhost:5173

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Docker Support

For containerized deployment, use:

```bash
docker build -t splitwise-frontend .
docker run -p 80:80 splitwise-frontend
```

See [README.Docker.md](README.Docker.md) for detailed Docker instructions.

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run lint`: Run ESLint
- `npm run preview`: Preview production build locally

## Code Style

We use ESLint and Prettier for code formatting. Configuration can be found in:
- `.eslintrc.cjs`
- `.prettierrc` (if used)

## Component Guidelines

1. Use functional components with hooks
2. Keep components small and focused
3. Use proper prop-types or TypeScript for type checking
4. Follow the container/presenter pattern where applicable

## State Management

- Use React Context for global state
- Use local state (useState) for component-specific state
- Consider using React Query for server state management

## Testing

- Write unit tests for components and utilities
- Use React Testing Library for component testing
- Aim for good test coverage of business logic

## Performance Considerations

1. Use React.memo() for expensive computations
2. Implement proper code splitting
3. Optimize images and assets
4. Use lazy loading for routes and components

## Browser Support

The application supports:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the code style guidelines
2. Write meaningful commit messages
3. Add tests for new features
4. Update documentation as needed

## Troubleshooting

Common issues and solutions:

1. **Build fails**: Clear node_modules and reinstall
2. **Vite HMR issues**: Restart development server
3. **API connection fails**: Check backend URL configuration
