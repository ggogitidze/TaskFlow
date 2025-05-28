import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { boardApi, taskApi } from '../utils/api';
import io from 'socket.io-client'; // Remove or comment out

export const useBoardData = () => {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null); // Remove or comment out

  // Initialize socket connection
  useEffect(() => {
    console.log('Attempting to initialize Socket.io connection for board:', boardId);
    const newSocket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
      auth: {
        token: localStorage.getItem('token')
      },
      withCredentials: true,
      transports: ['websocket', 'polling'],
      path: '/socket.io/'
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    newSocket.on('connect', () => {
      console.log('Socket connected successfully');
      newSocket.emit('join-board', boardId);
    });

    newSocket.on('task-updated', (updatedTask) => {
      setBoard(prevBoard => ({
        ...prevBoard,
        columns: prevBoard.columns.map(column => ({
          ...column,
          tasks: column.tasks.map(task =>
            task._id === updatedTask._id ? updatedTask : task
          )
        }))
      }));
    });

    newSocket.on('task-moved', (data) => {
      setBoard(prevBoard => ({
        ...prevBoard,
        columns: prevBoard.columns.map(column => ({
          ...column,
          tasks: column._id === data.fromColumnId
            ? column.tasks.filter(task => task._id !== data.taskId)
            : column._id === data.toColumnId
            ? [...column.tasks, data.task]
            : column.tasks
        }))
      }));
    });

    newSocket.on('task-created', (newTask) => {
      setBoard(prevBoard => ({
        ...prevBoard,
        columns: prevBoard.columns.map(column =>
          column._id === newTask.columnId
            ? { ...column, tasks: [...column.tasks, newTask] }
            : column
        )
      }));
    });

    newSocket.on('task-deleted', (taskId) => {
      setBoard(prevBoard => ({
        ...prevBoard,
        columns: prevBoard.columns.map(column => ({
          ...column,
          tasks: column.tasks.filter(task => task._id !== taskId)
        }))
      }));
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [boardId]);

  // Fetch board data
  useEffect(() => {
    const fetchBoard = async () => {
      try {
        setLoading(true);
        const response = await boardApi.getOne(boardId);
        setBoard(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
  }, [boardId]);

  // Task operations
  const createTask = async (columnId, taskData) => {
    try {
      const response = await taskApi.create(boardId, { ...taskData, columnId });

      console.log("Response from task creation:", response.data);

      setBoard(prevBoard => ({
        ...prevBoard,
        columns: prevBoard.columns.map(column =>
          column._id === columnId
            ? { ...column, tasks: [...column.tasks, response.data] }
            : column
        )
      }));
      socket?.emit('task-created', { boardId, task: response.data }); // Remove or comment out
    } catch (err) {
      console.error('Failed to create task:', err);
      throw err;
    }
  };

  const updateTask = async (taskId, taskData) => {
    try {
      const response = await taskApi.update(boardId, taskId, taskData);
      setBoard(prevBoard => ({
        ...prevBoard,
        columns: prevBoard.columns.map(column => ({
          ...column,
          tasks: column.tasks.map(task =>
            task._id === taskId ? response.data : task
          )
        }))
      }));
      socket?.emit('task-updated', { boardId, task: response.data }); // Remove or comment out
    } catch (err) {
      if (err.response && err.response.status === 403) {
        throw new Error(err.response.data.message || 'You do not have permission to update this task.');
      }
      throw err;
    }
  };

  const moveTask = async (taskId, fromColumnId, toColumnId, index) => {
    try {
      // Find the task to be moved before the optimistic update
      let movedTask = null;
      setBoard(prevBoard => {
        // Create a new array of columns
        const newColumns = prevBoard.columns.map(column => {
          // If this is the source column, remove the task immutably
          if (column._id === fromColumnId) {
            // Capture the moved task here
            movedTask = column.tasks.find(task => task._id === taskId);
            return { ...column, tasks: column.tasks.filter(task => task._id !== taskId) };
          }
          // If this is the destination column, prepare to add the task
          if (column._id === toColumnId) {
             // We need the task object. Use the captured movedTask.
             if (movedTask) {
                const tasks = [...column.tasks]; // Create a copy of the tasks array
                tasks.splice(index, 0, movedTask); // Insert the moved task at the correct index
                 return { ...column, tasks: tasks }; // Return new column object with updated tasks array
             }
          }
          // For other columns, return them as is
          return column;
        });

        // Return new board state with the updated columns array
        return { ...prevBoard, columns: newColumns };
      });

      // Call the API to update the backend
      await taskApi.move(boardId, taskId, {
        fromColumnId,
        toColumnId,
        index
      });

      // If API call is successful, emit the socket event with the captured task data
      if (socket && movedTask) {
        socket.emit('task-moved', {
          boardId,
          taskId,
          fromColumnId,
          toColumnId,
          task: movedTask // Use the captured movedTask object
        });
      }
    } catch (err) {
      if (err.response && err.response.status === 403) {
        throw new Error(err.response.data.message || 'You do not have permission to move this task.');
      }
      console.error('Failed to move task:', err);
      // TODO: Implement UI rollback if API call fails
      throw err;
    }
  };

  const deleteTask = async (taskId, columnId) => {
    // Optimistically update the UI first
    setBoard(prevBoard => ({
      ...prevBoard,
      columns: prevBoard.columns.map(column =>
        column._id === columnId
          ? { ...column, tasks: column.tasks.filter(task => task._id !== taskId) }
          : column
      )
    }));

    try {
      // Call the API to delete the task on the backend
      await taskApi.delete(boardId, taskId);

      // If API call is successful, the optimistic update is correct.
      // If API call fails, you might want to revert the UI change (not implemented here)

      socket?.emit('task-deleted', { boardId, taskId }); // Remove or comment out
    } catch (err) {
      if (err.response && err.response.status === 403) {
        throw new Error(err.response.data.message || 'You do not have permission to delete this task.');
      }
      console.error('Failed to delete task:', err);
      // TODO: Implement UI rollback if API call fails
      // Revert state if the API call fails
      setBoard(prevBoard => { /* logic to add task back */ return prevBoard }); // Placeholder
      throw err;
    }
  };

  return {
    board,
    loading,
    error,
    createTask,
    updateTask,
    moveTask,
    deleteTask,
    socket
  };
}; 