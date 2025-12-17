# Splitwise Web

A full-stack expense sharing application that helps users manage and split expenses within groups. Built with modern web technologies, this application provides a comprehensive solution for tracking shared expenses, managing group finances, and settling debts efficiently.

## 📖 About This Project

Splitwise Web is a complete expense management platform designed to simplify the process of splitting bills and tracking shared expenses among friends, roommates, or any group. Whether you're sharing rent, splitting dinner bills, or managing group travel expenses, this application makes it easy to track who owes what and settle debts with minimal transactions.

### Key Highlights

- **Full-Stack Solution**: Complete backend API and modern frontend application
- **Multi-Currency Support**: Handle expenses in EUR, USD, and BDT
- **Intelligent Debt Settlement**: Algorithms to minimize the number of transactions needed
- **Real-Time Analytics**: Track expenses with daily, monthly, and category-based reports
- **Secure & Scalable**: Built with security best practices and production-ready architecture
- **Containerized Deployment**: Docker support for easy deployment and scaling

## 🏗️ Repository Structure

This repository is organized using **git subtree** and contains two main components:

```
splitwise-web/
├── backend/          # Node.js/Express REST API server
├── frontend/         # React-based web application
└── README.md         
```

### Backend

The backend is a comprehensive RESTful API service built with:
- **Node.js** and **TypeScript**
- **Express.js** framework
- **MongoDB** with Mongoose ODM
- **JWT** authentication
- Comprehensive API documentation with Swagger

**📚 For detailed backend documentation, setup instructions, and API reference, see [backend/README.md](backend/README.md)**

### Frontend

The frontend is a modern, responsive web application built with:
- **React** for UI components
- **Vite** for fast development and building
- Modern state management and routing
- Responsive design for all devices

**📚 For detailed frontend documentation, setup instructions, and development guide, see [frontend/README.md](frontend/README.md)**

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn**
- **Docker** (optional, for containerized deployment)

### Running the Application

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd splitwise-web
   ```

2. **Start the Backend**:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Configure your .env file with MongoDB URI and other settings
   npm run dev
   ```
   The backend API will be available at `http://localhost:4004`

3. **Start the Frontend** (in a new terminal):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The frontend application will be available at `http://localhost:5173`

4. **Access the Application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4004/api/v1
   - API Documentation: http://localhost:4004/api-docs

### Docker Deployment

For containerized deployment, both backend and frontend include Docker configurations:

```bash
# Backend
cd backend
docker-compose up

# Frontend
cd frontend
docker-compose up
```

Refer to the respective README files for detailed Docker deployment instructions.

## ✨ Features

### User Management
- User registration and authentication
- Secure JWT-based authorization
- Profile management and settings

### Group Management
- Create and manage expense groups
- Add/remove group members
- Set group currency preferences
- Track group balances

### Expense Tracking
- Add expenses with multiple split options:
  - Equal split among members
  - Percentage-based split
  - Exact amount split
- Categorize expenses
- Add descriptions and notes
- Upload receipts (planned feature)

### Analytics & Reporting
- Daily expense summaries
- Monthly expense reports
- Category-wise expense breakdown
- Group expense analytics
- Personal expense tracking

### Debt Settlement
- Intelligent debt simplification algorithms
- Minimize number of transactions
- Clear settlement history
- Multi-currency settlement support

## 🛠️ Technology Stack

### Backend
- Node.js 18+ with TypeScript
- Express.js framework
- MongoDB with Mongoose ODM
- JWT authentication with bcrypt
- Winston logging
- Swagger/OpenAPI documentation
- Docker containerization

### Frontend
- React 18+
- Vite build tool
- Modern JavaScript/TypeScript
- Responsive CSS design
- RESTful API integration

## 📚 Documentation

Each component has its own comprehensive documentation:

- **[Backend Documentation](backend/README.md)** - Complete backend setup, API reference, database schema, deployment guides, and more
- **[Frontend Documentation](frontend/README.md)** - Frontend setup, development guide, component structure, and deployment instructions

Additional documentation available in the backend:
- API Documentation (Swagger UI)
- Database Schema
- Authentication & Authorization
- Testing Strategy
- Deployment & DevOps
- Monitoring & Logging

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Security headers with Helmet
- Environment-based configuration
- Secure session management

## 📄 License

This project is licensed under the Apache License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: Report bugs or request features via [GitHub Issues](../../issues)
- **Documentation**: Check the backend and frontend README files for detailed guides
- **Discussions**: Use [GitHub Discussions](../../discussions) for questions and ideas

## 🙏 Acknowledgments

This project is inspired by Splitwise and built as a learning project to demonstrate full-stack web development best practices.