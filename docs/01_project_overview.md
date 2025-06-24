# Project Overview

## Name
Splitwise Backend Service

## Description
A comprehensive expense splitting and group management backend service built with Node.js, TypeScript, Express, and MongoDB. This service provides APIs for user authentication, group management, expense tracking, and debt settlement calculations.

## Purpose
- Provide secure and scalable APIs for expense splitting applications
- Manage user authentication and authorization
- Handle group creation and member management
- Track expenses and calculate debt settlements
- Generate expense reports and analytics

## Key Features
- **User Management**: Registration, authentication, and profile management
- **Group Management**: Create groups, add/remove members, set group currencies
- **Expense Tracking**: Add, update, delete expenses with detailed categorization
- **Debt Settlement**: Intelligent debt simplification algorithms
- **Multi-currency Support**: EUR, USD, BDT with configurable group currencies
- **Expense Analytics**: Daily, monthly, and category-based expense reports
- **RESTful API**: Well-structured API with proper versioning (v1)
- **Swagger Documentation**: Auto-generated API documentation

## Technology Stack
- **Runtime**: Node.js (v18+)
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcrypt for password hashing, Helmet for security headers
- **Documentation**: Swagger/OpenAPI
- **Logging**: Winston and Morgan
- **Development**: Nodemon, ESLint, Prettier

## Goals
- Scalable and secure backend architecture
- RESTful API with clear versioning and documentation
- Robust authentication and authorization system
- Efficient debt settlement algorithms
- Comprehensive expense tracking and reporting
- Multi-currency support for global usage
- High performance with proper error handling

## Stakeholders
- **Product Manager**: Feature requirements and business logic
- **Backend Team**: API development and maintenance
- **Frontend Team**: API integration and data consumption
- **DevOps Team**: Deployment and infrastructure management
- **QA Team**: Testing and quality assurance
- **End Users**: Expense splitting and group management

## Project Structure
```
splitwise-backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── models/         # Database schemas
│   ├── services/       # Business logic
│   ├── routes/         # API endpoints
│   ├── middlewares/    # Custom middleware
│   ├── utils/          # Utility functions
│   └── server.ts       # Application entry point
├── config/             # Configuration files
├── docs/              # Documentation
├── tests/             # Test files
└── docker/            # Docker configuration
```
