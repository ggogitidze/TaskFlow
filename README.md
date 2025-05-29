# TaskFlow - Modern Task Management Platform

A sophisticated real-time task management application built with React, Node.js, and Socket.io. TaskFlow enables seamless team collaboration through an intuitive interface and powerful features.

## Key Features

- Real-time collaboration with instant updates across all users
- Intuitive drag-and-drop task management
- Secure JWT-based authentication system
- Dynamic board and task management
- Responsive design powered by TailwindCSS
- Modern React architecture utilizing hooks and context

## Technical Architecture

### Frontend
- React 18+ with modern hooks and context
- TailwindCSS for responsive design
- React DnD for intuitive drag-and-drop
- Socket.io Client for real-time updates
- React Router for seamless navigation

### Backend
- Node.js with Express
- MongoDB for data persistence
- Socket.io for real-time communication
- JWT for secure authentication

## Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd taskflow
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the root directory:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

4. Launch development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Project Architecture

```
src/
├── components/          # Reusable UI components
│   ├── Sidebar.jsx     # Navigation sidebar
│   ├── TopNav.jsx      # Top navigation bar
│   ├── Column.jsx      # Task column component
│   ├── TaskCard.jsx    # Individual task card
│   └── modals/         # Modal components
├── pages/              # Page components
│   ├── LoginPage.jsx   # Authentication page
│   └── BoardPage.jsx   # Main board page
├── context/            # React context
│   └── AuthContext.js  # Authentication context
├── hooks/              # Custom hooks
│   └── useBoardData.js # Board data management
├── utils/              # Utility functions
│   └── api.js         # API client
├── App.jsx            # Main application component
└── main.jsx           # Application entry point
```

## Development Workflow

1. Create a feature branch (`git checkout -b feature/feature-name`)
2. Implement your changes
3. Commit your changes (`git commit -m 'Add feature: description'`)
4. Push to the branch (`git push origin feature/feature-name`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 