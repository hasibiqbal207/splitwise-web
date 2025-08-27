# System Architecture

## Overview
The Splitwise Backend Service follows a layered architecture pattern built with Node.js, TypeScript, Express, and MongoDB. The system is designed as a RESTful API service with clear separation of concerns, modular design, and scalable architecture.

## Architecture Pattern
**Layered Architecture (3-Tier)**
- **Presentation Layer**: Express.js routes and controllers
- **Business Logic Layer**: Services and utilities
- **Data Access Layer**: Mongoose models and database operations

## System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Applications                      │
│  (Web App, Mobile App, Third-party Integrations)           │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTPS/HTTP
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway Layer                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   CORS          │  │   Helmet        │  │   Morgan     │ │
│  │   Middleware    │  │   Security      │  │   Logging    │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │ Authentication  │  │ User Management │  │ Group        │ │
│  │ Routes          │  │ Routes          │  │ Routes       │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │ Expense Routes  │  │ JWT Validation  │  │ Error        │ │
│  │ (User/Group)    │  │ Middleware      │  │ Handling     │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │ Authentication  │  │ User Service    │  │ Group        │ │
│  │ Service         │  │                 │  │ Service      │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │ Expense Service │  │ Debt Settlement │  │ Validation   │ │
│  │                 │  │ Algorithm       │  │ Utils        │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Access Layer                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │ User Model      │  │ Group Model     │  │ Expense      │ │
│  │ (Mongoose)      │  │ (Mongoose)      │  │ Model        │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │ Settlement      │  │ Database        │  │ Connection   │ │
│  │ Model           │  │ Configuration   │  │ Pool         │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Storage Layer                       │
│                    MongoDB Database                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │ users           │  │ groups          │  │ expenses     │ │
│  │ collection      │  │ collection      │  │ collection   │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
│  ┌─────────────────┐                                        │
│  │ settlements     │                                        │
│  │ collection      │                                        │
│  └─────────────────┘                                        │
└─────────────────────────────────────────────────────────────┘
```

## Components

### 1. Presentation Layer
- **Express.js Server**: Main application server with middleware configuration
- **Route Handlers**: API endpoint definitions and request routing
- **Controllers**: Request/response handling and input validation
- **Middleware**: Authentication, logging, CORS, security headers

### 2. Business Logic Layer
- **Authentication Service**: User registration, login, JWT token management
- **User Service**: User profile management and operations
- **Group Service**: Group creation, member management, balance tracking
- **Expense Service**: Expense CRUD operations, analytics, reporting
- **Debt Settlement Algorithm**: Intelligent debt simplification logic
- **Validation Utils**: Input validation and data sanitization

### 3. Data Access Layer
- **Mongoose Models**: Database schema definitions and validation
- **Database Configuration**: MongoDB connection and configuration
- **Query Operations**: Database CRUD operations and aggregations

## Key Design Patterns

### 1. MVC Pattern
- **Models**: Mongoose schemas for data structure
- **Views**: JSON responses for API endpoints
- **Controllers**: Request handling and business logic coordination

### 2. Repository Pattern
- **Service Layer**: Abstracts business logic from data access
- **Model Layer**: Handles database operations and data validation

### 3. Middleware Pattern
- **Authentication Middleware**: JWT token validation
- **Logging Middleware**: Request/response logging
- **Error Handling Middleware**: Centralized error management

### 4. Dependency Injection
- **Service Dependencies**: Services inject models for data access
- **Controller Dependencies**: Controllers inject services for business logic

## Data Flow

### 1. Request Flow
```
Client Request → CORS/Helmet → Morgan Logging → Route → Controller → Service → Model → Database
```

### 2. Response Flow
```
Database → Model → Service → Controller → Response → Client
```

### 3. Authentication Flow
```
Request → JWT Validation → Route Handler → Business Logic → Response
```

## Security Architecture

### 1. Authentication
- **JWT Tokens**: Stateless authentication with secure token generation
- **Password Hashing**: bcrypt with salt rounds for secure storage
- **Token Validation**: Middleware-based token verification

### 2. Authorization
- **Route Protection**: JWT middleware for protected routes
- **User Context**: User information available in request context
- **Resource Ownership**: Validation of resource ownership

### 3. Security Headers
- **Helmet**: Security headers for XSS, CSRF protection
- **CORS**: Cross-origin resource sharing configuration
- **Input Validation**: Comprehensive input sanitization

## Scalability Considerations

### 1. Horizontal Scaling
- **Stateless Design**: No server-side session storage
- **Load Balancer Ready**: Multiple server instances support
- **Database Scaling**: MongoDB sharding and replication

### 2. Performance Optimization
- **Database Indexing**: Optimized queries with proper indexes
- **Connection Pooling**: Efficient database connection management
- **Caching Strategy**: Redis integration ready (future enhancement)

### 3. Monitoring & Logging
- **Winston Logger**: Structured logging for application events
- **Morgan**: HTTP request logging
- **Error Tracking**: Centralized error handling and reporting

## Technology Stack Details

### Core Technologies
- **Node.js**: JavaScript runtime environment
- **TypeScript**: Static typing and enhanced development experience
- **Express.js**: Web application framework
- **MongoDB**: NoSQL document database
- **Mongoose**: MongoDB object modeling tool

### Development Tools
- **Nodemon**: Development server with auto-restart
- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting
- **Swagger**: API documentation generation

### Production Tools
- **Docker**: Containerization for deployment
- **PM2**: Process management (recommended for production)
- **Nginx**: Reverse proxy (recommended for production)
