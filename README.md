# Splitwise Backend

The backend server for Splitwise built with Node.js, Express, and TypeScript.

## Technology Stack

- Node.js
- Express.js
- TypeScript
- MongoDB (database)
- JWT for authentication
- Docker support

## Project Structure

```
backend/
├── src/
│   ├── controllers/  # Request handlers
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   ├── middlewares/  # Custom middleware
│   ├── services/     # Business logic
│   ├── utils/        # Utility functions
│   └── server.ts     # Server configuration
├── config/          # Configuration files
├── docs/           # API documentation
├── docker/         # Docker configuration
└── tests/          # Test files
```

## Development

### Prerequisites

- Node.js (version specified in .nvmrc)
- MongoDB
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
- Copy `.env.example` to `.env`
- Update the variables as needed

3. Start development server:
```bash
npm run dev
```

The server will be available at http://localhost:3000

### Building for Production

```bash
npm run build
```

The compiled files will be in the `dist/` directory.

### Docker Support

Run with Docker:

```bash
docker-compose up
```

This will start both the application and MongoDB.

## Available Scripts

- `npm run dev`: Start development server with hot reload
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run test`: Run tests
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier

## API Documentation

### Authentication Endpoints

- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me

### User Endpoints

- GET /api/users
- GET /api/users/:id
- PUT /api/users/:id
- DELETE /api/users/:id

### Group Endpoints

- POST /api/groups
- GET /api/groups
- GET /api/groups/:id
- PUT /api/groups/:id
- DELETE /api/groups/:id

### Expense Endpoints

- POST /api/expenses
- GET /api/expenses
- GET /api/expenses/:id
- PUT /api/expenses/:id
- DELETE /api/expenses/:id

Detailed API documentation is available in the `/docs` directory.

## Database

### Models

1. User Model
```typescript
{
  name: string;
  email: string;
  password: string;
  friends: User[];
  groups: Group[];
}
```

2. Group Model
```typescript
{
  name: string;
  members: User[];
  expenses: Expense[];
  createdBy: User;
}
```

3. Expense Model
```typescript
{
  description: string;
  amount: number;
  paidBy: User;
  splitBetween: [{
    user: User;
    amount: number;
  }];
  group: Group;
  date: Date;
}
```

## Error Handling

- Custom error classes in `src/utils/errors`
- Global error handler middleware
- Standardized error responses

## Security

- JWT based authentication
- Request validation
- Rate limiting
- CORS configuration
- Helmet for security headers

## Testing

- Jest for unit tests
- Supertest for integration tests
- Test coverage reports

## Monitoring and Logging

- Winston for logging
- Morgan for HTTP request logging
- Error tracking setup

## Performance Considerations

1. Database indexing
2. Caching strategies
3. Rate limiting
4. Query optimization

## Contributing

1. Follow TypeScript best practices
2. Write unit tests
3. Update API documentation
4. Follow the git workflow

## Deployment

1. Build the application
2. Set production environment variables
3. Start with process manager (PM2)
4. Configure reverse proxy

## Troubleshooting

Common issues and solutions:

1. **Database connection fails**: Check MongoDB connection string
2. **Authentication issues**: Verify JWT secret
3. **TypeScript compilation errors**: Check tsconfig.json
