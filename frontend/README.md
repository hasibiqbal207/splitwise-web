# Splitwise Application

A modern expense sharing application built with React and Node.js that helps users manage and split expenses within groups.

## Project Structure

The project is organized into two main components:

- `frontend/`: React-based web application
- `backend/`: Node.js/Express REST API server

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Docker (optional, for containerized deployment)

### Running the Application

1. Clone the repository:
```bash
git clone <repository-url>
cd splitwise-web
```

2. Start the Backend:
```bash
cd backend
npm install
npm run dev
```

3. Start the Frontend:
```bash
cd frontend
npm install
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Features

- User authentication and authorization
- Create and manage groups
- Add and split expenses
- Multiple splitting options (equal, percentage, exact amounts)
- Real-time expense calculations
- Transaction history and summaries
- User profile management

## Documentation

- [Frontend Documentation](frontend/README.md)
- [Backend Documentation](backend/README.md)
- [API Documentation](backend/docs/API.md)
- [Docker Deployment](frontend/README.Docker.md)

## Contributing

We welcome contributions! Please read our contribution guidelines before submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the repository or contact the maintainers.
