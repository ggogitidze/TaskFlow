import { useDrop } from 'react-dnd';
import { useState } from 'react';
import TaskCard from './TaskCard';
import { useBoardData } from '../hooks/useBoardData';
import PermissionModal from './PermissionModal';

const Column = ({ column, openTaskDetailModal }) => {
  const { createTask, moveTask } = useBoardData();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskChecklist, setNewTaskChecklist] = useState([]);
  const [permissionModal, setPermissionModal] = useState({ open: false, message: '' });

  // Set up drop target
  const [{ isOver }, drop] = useDrop({
    accept: 'TASK',
    drop: async (item, monitor) => {
      if (item.columnId !== column._id) {
        try {
          await moveTask(item.id, item.columnId, column._id, column.tasks.length);
        } catch (error) {
          setPermissionModal({ open: true, message: error.message });
        }
      } else {
        // Handle reordering within the same column if needed later
        // For now, just prevent the default drop if it's the same column
        return { didDrop: false };
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  });

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      await createTask(column._id, {
        title: newTaskTitle,
        description: newTaskDescription,
        priority: newTaskPriority,
        dueDate: newTaskDueDate,
        checklist: newTaskChecklist,
      });
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskPriority('medium');
      setNewTaskDueDate('');
      setNewTaskChecklist([]);
      setIsAddingTask(false);
    } catch (error) {
      setPermissionModal({ open: true, message: error.message });
    }
  };

  return (
    <div
      ref={drop}
      className={`flex-1 min-w-[300px] rounded-lg p-4 shadow-md bg-secondary-bg-light dark:bg-secondary-bg-dark ${isOver ? 'ring-2 ring-accent-button-light dark:ring-accent-button-dark' : ''}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-primary-text-light dark:text-primary-text-dark">{column.title}</h2>
        <span className="text-sm text-secondary-text-light dark:text-secondary-text-dark opacity-90">{column.tasks.length}</span>
      </div>

      <div className="space-y-2">
        {column.tasks.map((task) => (
          <TaskCard key={task._id} task={task} columnId={column._id} openTaskDetailModal={openTaskDetailModal} />
        ))}
      </div>

      {isAddingTask ? (
        <form onSubmit={handleAddTask} className="mt-4 space-y-3">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-secondary-bg-dark text-primary-text-light dark:text-primary-text-dark focus:outline-none focus:ring-2 focus:ring-accent-button-light dark:focus:ring-accent-button-dark"
            placeholder="Task title"
            autoFocus
          />
          <textarea
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-secondary-bg-dark text-secondary-text-light dark:text-secondary-text-dark focus:outline-none focus:ring-2 focus:ring-accent-button-light dark:focus:ring-accent-button-dark"
            placeholder="Task description (optional)"
            rows="2"
          />

          {/* Priority Select */}
          <div>
            <label htmlFor="newTaskPriority" className="block text-sm font-medium text-primary-text-light dark:text-primary-text-dark">Priority</label>
            <select
              id="newTaskPriority"
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-secondary-bg-dark text-secondary-text-light dark:text-secondary-text-dark"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Due Date Input */}
          <div>
            <label htmlFor="newTaskDueDate" className="block text-sm font-medium text-primary-text-light dark:text-primary-text-dark">Due Date</label>
            <input
              id="newTaskDueDate"
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-secondary-bg-dark text-secondary-text-light dark:text-secondary-text-dark"
            />
          </div>

          {/* Checklist Section (Simplified for Add Task) */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-primary-text-light dark:text-primary-text-dark mb-2">Checklist</h4>
            {newTaskChecklist.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => {
                    const newChecklist = [...newTaskChecklist];
                    newChecklist[index].text = e.target.value;
                    setNewTaskChecklist(newChecklist);
                  }}
                  className="flex-1 p-1 border rounded bg-secondary-bg-light dark:bg-secondary-bg-dark border-gray-300 dark:border-gray-600 text-secondary-text-light dark:text-secondary-text-dark"
                  placeholder="Checklist item"
                />
                <button
                  type="button"
                  onClick={() => {
                    setNewTaskChecklist(newTaskChecklist.filter((_, i) => i !== index));
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setNewTaskChecklist([...newTaskChecklist, { text: '', completed: false }])}
              className="text-sm text-accent-button-light hover:text-accent-button-dark"
            >
              + Add item
            </button>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                setIsAddingTask(false);
                setNewTaskTitle('');
                setNewTaskDescription('');
                setNewTaskPriority('medium');
                setNewTaskDueDate('');
                setNewTaskChecklist([]);
              }}
              className="px-4 py-2 text-sm font-medium text-secondary-text-light dark:text-secondary-text-dark hover:text-primary-text-light dark:hover:text-primary-text-dark rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-accent-button-light text-accent-button-text-light rounded-md hover:bg-accent-button-dark focus:outline-none focus:ring-2 focus:ring-accent-button-light dark:bg-accent-button-dark dark:hover:bg-accent-button-light dark:text-accent-button-text-dark dark:focus:ring-accent-button-dark"
            >
              Add Task
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsAddingTask(true)}
          className="w-full mt-4 p-2 text-sm text-secondary-text-light hover:text-primary-text-light hover:bg-gray-100 rounded dark:text-secondary-text-dark dark:hover:text-primary-text-dark dark:hover:bg-gray-700"
        >
          + Add Task
        </button>
      )}
      <PermissionModal open={permissionModal.open} onClose={() => setPermissionModal({ open: false, message: '' })} message={permissionModal.message} />
    </div>
  );
};

export default Column; 