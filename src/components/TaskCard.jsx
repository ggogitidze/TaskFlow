import { useDrag } from 'react-dnd';
import { useState, useEffect } from 'react';
import { useBoardData } from '../hooks/useBoardData';

const TrashIcon = ({ className }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
);

const TaskCard = ({ task, columnId, openTaskDetailModal }) => {
  const { updateTask, deleteTask } = useBoardData();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [checklist, setChecklist] = useState(task.checklist || []);
  const [priority, setPriority] = useState(task.priority || 'medium');
  const [dueDate, setDueDate] = useState(task.dueDate || '');

  // Add useEffect to update state when task prop changes
  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description);
    setChecklist(task.checklist || []);
    setPriority(task.priority || 'medium');
    setDueDate(task.dueDate || '');
  }, [task]);

  // Set up drag and drop
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task._id, columnId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  // Add this log to inspect the task object
  console.log("TaskCard received task ID:", task._id); // More specific log

  const handleSave = async () => {
    try {
      await updateTask(task._id, { 
        title, 
        description,
        checklist,
        priority,
        dueDate
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(task._id, columnId);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const handleCardClick = () => {
    if (!isEditing) {
      openTaskDetailModal(task);
    }
  };

  const handleChecklistItemToggle = (index) => {
    const newChecklist = [...checklist];
    newChecklist[index] = {
      ...newChecklist[index],
      completed: !newChecklist[index].completed
    };
    setChecklist(newChecklist);
  };

  const handleAddChecklistItem = () => {
    setChecklist([...checklist, { text: '', completed: false }]);
  };

  const handleChecklistItemChange = (index, value) => {
    const newChecklist = [...checklist];
    newChecklist[index] = { ...newChecklist[index], text: value };
    setChecklist(newChecklist);
  };

  const handleRemoveChecklistItem = (index) => {
    setChecklist(checklist.filter((_, i) => i !== index));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const calculateProgress = () => {
    if (checklist.length === 0) return 0;
    const completed = checklist.filter(item => item.completed).length;
    return (completed / checklist.length) * 100;
  };

  const isOverdue = () => {
    if (!dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDueDate = new Date(dueDate);
    taskDueDate.setHours(0, 0, 0, 0);
    return taskDueDate < today;
  };

  return (
    <div
      ref={drag}
      className={`rounded-lg shadow-md p-4 mb-2 cursor-pointer bg-secondary-bg-light dark:bg-secondary-bg-dark ${isDragging ? 'opacity-50' : ''}`}
      onClick={handleCardClick}
    >
      {isEditing ? (
        <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 p-2 border rounded bg-secondary-bg-light dark:bg-secondary-bg-dark border-gray-300 dark:border-gray-600 text-primary-text-light dark:text-primary-text-dark focus:outline-none focus:ring-2 focus:ring-accent-button-light dark:focus:ring-accent-button-dark"
              placeholder="Task title"
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="p-2 border rounded bg-secondary-bg-light dark:bg-secondary-bg-dark border-gray-300 dark:border-gray-600 text-secondary-text-light dark:text-secondary-text-dark"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded bg-secondary-bg-light dark:bg-secondary-bg-dark border-gray-300 dark:border-gray-600 text-secondary-text-light dark:text-secondary-text-dark focus:outline-none focus:ring-2 focus:ring-accent-button-light dark:focus:ring-accent-button-dark"
            placeholder="Task description"
            rows="3"
          />

          {/* Due Date Input */}
          <div className="flex items-center space-x-2">
            <label className="text-secondary-text-light dark:text-secondary-text-dark text-sm">Due Date:</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="p-2 border rounded bg-secondary-bg-light dark:bg-secondary-bg-dark border-gray-300 dark:border-gray-600 text-secondary-text-light dark:text-secondary-text-dark"
            />
          </div>

          {/* Checklist Section */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-primary-text-light dark:text-primary-text-dark mb-2">Checklist</h4>
            {checklist.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => handleChecklistItemToggle(index)}
                  className="rounded text-accent-button-light dark:text-accent-button-dark"
                />
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => handleChecklistItemChange(index, e.target.value)}
                  className="flex-1 p-1 border rounded bg-secondary-bg-light dark:bg-secondary-bg-dark border-gray-300 dark:border-gray-600 text-secondary-text-light dark:text-secondary-text-dark"
                  placeholder="Checklist item"
                />
                <button
                  onClick={() => handleRemoveChecklistItem(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={handleAddChecklistItem}
              className="text-sm text-accent-button-light hover:text-accent-button-dark"
            >
              + Add item
            </button>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={(e) => { e.stopPropagation(); setIsEditing(false); }}
              className="px-3 py-1 text-sm text-secondary-text-light hover:text-primary-text-light dark:text-secondary-text-dark dark:hover:text-primary-text-dark"
            >
              Cancel
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleSave(); }}
              className="px-3 py-1 text-sm bg-accent-button-light text-accent-button-text-light rounded hover:bg-accent-button-dark dark:bg-accent-button-dark dark:hover:bg-accent-button-light dark:text-accent-button-text-dark"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${getPriorityColor(priority)}`} />
              <h3 className="font-medium text-primary-text-light dark:text-primary-text-dark">{title}</h3>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                className="text-secondary-text-light hover:text-primary-text-light dark:text-secondary-text-dark dark:hover:text-primary-text-dark"
                aria-label="Edit Task"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                  <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={handleDelete}
                className="p-1 rounded text-secondary-text-light hover:text-red-500 focus:text-red-600 dark:text-secondary-text-dark dark:hover:text-red-500 dark:focus:text-red-600 transition-colors"
                aria-label="Delete Task"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {description && (
            <p className="text-sm text-secondary-text-light dark:text-secondary-text-dark opacity-90">{description}</p>
          )}

          {/* Progress Bar */}
          {checklist.length > 0 && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-accent-button-light h-2.5 rounded-full dark:bg-accent-button-dark"
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
              <p className="text-xs text-secondary-text-light dark:text-secondary-text-dark opacity-90 mt-1">
                {checklist.filter(item => item.completed).length} of {checklist.length} completed
              </p>
            </div>
          )}

          {/* Checklist Preview (Full) */}
          {checklist.length > 0 && (
            <div className="mt-2 space-y-1">
              {checklist.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => handleChecklistItemToggle(index)}
                    className="rounded text-accent-button-light dark:text-accent-button-dark"
                  />
                  <span className={`text-sm text-secondary-text-light dark:text-secondary-text-dark ${item.completed ? 'line-through' : ''}`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Due Date Display */}
          {dueDate && (
            <div className={`mt-2 text-sm ${isOverdue() ? 'text-red-500' : 'text-secondary-text-light dark:text-secondary-text-dark'} opacity-90`}>
              Due: {new Date(dueDate).toLocaleDateString()}
              {isOverdue() && ' (Overdue)'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskCard; 