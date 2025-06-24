# Splitwise Backend

A comprehensive expense splitting and group management backend service built with Node.js, TypeScript, Express, and MongoDB. This service provides secure APIs for user authentication, group management, expense tracking, and intelligent debt settlement calculations.

## 🚀 Features

- **User Management**: Registration, authentication, and profile management with JWT
- **Group Management**: Create groups, manage members, set currencies (EUR, USD, BDT)
- **Expense Tracking**: Add, categorize, and split expenses with detailed analytics
- **Debt Settlement**: Intelligent algorithms to minimize transaction complexity
- **Multi-Currency Support**: Handle expenses in EUR, USD, and BDT
- **Real-time Analytics**: Daily, monthly, and category-based expense reports
- **RESTful API**: Well-structured API with comprehensive documentation
- **Security**: JWT authentication, password hashing, CORS, and input validation

## 🛠 Technology Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt password hashing
- **Documentation**: Swagger/OpenAPI
- **Logging**: Winston and Morgan
- **Development**: Nodemon, ESLint, Prettier
- **Containerization**: Docker with multi-stage builds
- **CI/CD**: GitHub Actions

## 📁 Project Structure

```
splitwise-backend/
├── src/
│   ├── controllers/     # Request handlers
│   │   ├── authentication.controller.ts
│   │   ├── user.controller.ts
│   │   ├── group.controller.ts
│   │   └── expense/
│   │       ├── expenseOperations.controller.ts
│   │       ├── groupExpenses.controller.ts
│   │       └── userExpenses.controller.ts
│   ├── models/         # Database schemas
│   │   ├── user.model.ts
│   │   ├── group.model.ts
│   │   ├── expense.model.ts
│   │   └── settlement.model.ts
│   ├── services/       # Business logic
│   │   ├── authentication.service.ts
│   │   ├── user.service.ts
│   │   ├── group.service.ts
│   │   └── expense.service.ts
│   ├── routes/         # API endpoints
│   │   ├── authentication.route.ts
│   │   ├── user.route.ts
│   │   ├── group.route.ts
│   │   └── expense/
│   │       ├── expense.route.ts
│   │       ├── group.expense.route.ts
│   │       └── user.expense.route.ts
│   ├── middlewares/    # Custom middleware
│   │   └── logger.middleware.ts
│   ├── utils/          # Utility functions
│   │   ├── apiAuthentication.ts
│   │   ├── handleAsync.ts
│   │   ├── split.ts
│   │   └── validation.ts
│   └── server.ts       # Application entry point
├── config/             # Configuration files
│   ├── database.config.ts
│   ├── logger.config.ts
│   └── swagger.config.ts
├── docs/              # Comprehensive documentation
├── docker/            # Docker configuration
├── tests/             # Test files
└── package.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd splitwise-backend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
```bash
cp .env.example .env
```

Update the `.env` file with your configuration:
```bash
# Server Configuration
NODE_ENV=development
PORT=4004

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/splitwise_dev

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

4. **Start development server**:
```bash
npm run dev
```

The server will be available at `http://localhost:4004`

### Docker Setup

For containerized development:

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f app
```

## 📚 API Documentation

### Base URL
```
http://localhost:4004/api/v1
```

### Authentication
All protected endpoints require a JWT token:
```
Authorization: Bearer <your-jwt-token>
```

### Key Endpoints

#### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

#### Users
- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update user profile

#### Groups
- `POST /group` - Create group
- `GET /group` - Get all user groups
- `GET /group/:id` - Get specific group
- `PUT /group/:id` - Update group
- `DELETE /group/:id` - Delete group
- `POST /group/:id/members` - Add member
- `DELETE /group/:id/members/:email` - Remove member

#### Expenses
- `POST /expense` - Create expense
- `GET /expense` - Get all expenses
- `GET /expense/:id` - Get specific expense
- `PUT /expense/:id` - Update expense
- `DELETE /expense/:id` - Delete expense

#### Analytics
- `GET /expense/user/daily` - Daily user expenses
- `GET /expense/user/monthly` - Monthly user expenses
- `GET /expense/user/category` - Expenses by category
- `GET /expense/group/:id/daily` - Daily group expenses
- `GET /expense/group/:id/monthly` - Monthly group expenses

### Interactive API Documentation

Access the Swagger UI at: `http://localhost:4004/api-docs`

## 🗄 Database Schema

### Collections

1. **Users** - User accounts and authentication
2. **Groups** - Expense groups with member management
3. **Expenses** - Individual expenses with categorization
4. **Settlements** - Debt settlement transactions

### Key Features
- Multi-currency support (EUR, USD, BDT)
- Expense categorization
- Balance tracking per group member
- Intelligent debt simplification

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report

# Docker
npm run docker:build # Build Docker image
npm run docker:run   # Run Docker container
```

## 📖 Documentation

For detailed information, refer to the comprehensive documentation in the `/docs` directory:

- **[Project Overview](docs/01_project_overview.md)** - Project description, goals, and stakeholders
- **[Requirements Specification](docs/02_requirements_spec.md)** - Functional and non-functional requirements
- **[System Architecture](docs/03_architecture.md)** - Architecture patterns and design decisions
- **[API Documentation](docs/04_api_documentation.md)** - Complete API reference with examples
- **[Database Schema](docs/05_database_schema.md)** - Database design and relationships
- **[Authentication & Authorization](docs/06_auth_and_authz.md)** - Security implementation details
- **[Testing Plan](docs/07_testing_plan.md)** - Testing strategy and implementation
- **[Deployment & DevOps](docs/08_deployment_devops.md)** - Deployment and infrastructure setup
- **[Monitoring & Logging](docs/09_monitoring_logging.md)** - Observability and monitoring
- **[Changelog](docs/10_changelog.md)** - Version history and migration guides

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Configurable cross-origin resource sharing
- **Security Headers**: Helmet middleware for security headers
- **Rate Limiting**: Protection against API abuse (infrastructure ready)

## 🧪 Testing

The project includes comprehensive testing:

- **Unit Tests**: Service layer and utility functions
- **Integration Tests**: API endpoints and database operations
- **Performance Tests**: Load testing and response time validation
- **Security Tests**: Authentication and authorization validation

Run tests with:
```bash
npm run test
```

## 📊 Monitoring & Logging

- **Structured Logging**: Winston with JSON format
- **HTTP Request Logging**: Morgan middleware
- **Health Checks**: `/health` endpoint for monitoring
- **Metrics**: Prometheus metrics endpoint (ready for implementation)
- **Error Tracking**: Comprehensive error handling and logging

## 🚀 Deployment

### Production Deployment

1. **Build the application**:
```bash
npm run build
```

2. **Set production environment variables**:
```bash
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
```

3. **Deploy with Docker**:
```bash
docker-compose -f compose.prod.yaml up -d
```

### Environment-Specific Configurations

- **Development**: Hot reload, debug logging, local MongoDB
- **Staging**: Production-like environment for testing
- **Production**: Optimized builds, minimal logging, production database

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the coding standards and write tests
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write comprehensive tests for new features
- Update documentation for API changes
- Ensure all tests pass before submitting PR
- Follow semantic versioning for releases

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Fails**
   - Check MongoDB connection string in `.env`
   - Ensure MongoDB is running
   - Verify network connectivity

2. **Authentication Issues**
   - Verify JWT secret in environment variables
   - Check token expiration settings
   - Ensure proper Authorization header format

3. **TypeScript Compilation Errors**
   - Check `tsconfig.json` configuration
   - Ensure all dependencies are installed
   - Verify TypeScript version compatibility

4. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill existing processes on the port
   - Use different port for development

## 📈 Performance Considerations

- **Database Indexing**: Optimized queries with proper indexes
- **Connection Pooling**: Efficient database connection management
- **Caching Strategy**: Redis integration ready (future enhancement)
- **Query Optimization**: Aggregation pipelines for analytics
- **Response Compression**: Gzip compression for API responses

## 🔮 Roadmap

### Version 1.1.0 (Q2 2024)
- Multi-factor authentication (MFA)
- OAuth integration (Google, Facebook)
- Redis caching layer
- Advanced analytics and reporting

### Version 1.2.0 (Q3 2024)
- Real-time currency conversion
- Advanced group features
- Webhook support
- Mobile app API optimization

### Version 1.3.0 (Q4 2024)
- AI-powered expense categorization
- Predictive analytics
- Enterprise features
- Advanced security enhancements

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` directory for comprehensive guides
- **Issues**: Report bugs and request features via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Email**: Contact the development team for enterprise support
- 
---
