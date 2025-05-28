# TaskFlow - Real-time Task Management Board

A Trello-style task management application built with React, Node.js, and Socket.io. Features real-time collaboration, drag-and-drop task management, and JWT authentication.

## Features

- Real-time task updates across multiple users
- Drag-and-drop task management
- JWT authentication
- Create, edit, and delete boards and tasks
- Responsive design with TailwindCSS
- Modern React architecture with hooks and context

## Tech Stack

- Frontend:
  - React
  - TailwindCSS
  - React DnD (Drag and Drop)
  - Socket.io Client
  - React Router
- Backend:
  - Node.js + Express
  - MongoDB
  - Socket.io
  - JWT Authentication

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd taskflow
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Project Structure

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

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 