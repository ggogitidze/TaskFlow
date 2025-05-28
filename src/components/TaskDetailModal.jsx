import React, { useState, useEffect } from 'react';
import { useBoardData } from '../hooks/useBoardData';
import { format } from 'date-fns'; // Correct import
import PermissionModal from './PermissionModal';

const TaskDetailModal = ({ task, onClose, boardId }) => {
  const { updateTask } = useBoardData();
  const [description, setDescription] = useState(task?.description || '');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [title, setTitle] = useState(task?.title || '');
  const [permissionModal, setPermissionModal] = useState({ open: false, message: '' });

  useEffect(() => {
    setDescription(task?.description || '');
    setTitle(task?.title || '');
    setIsEditingDescription(false); // Reset editing state when task changes
  }, [task]);

  if (!task) {
    return null;
  }

  const handleSaveDescription = async () => {
    try {
      await updateTask(task._id, { description });
      setIsEditingDescription(false);
    } catch (error) {
      setPermissionModal({ open: true, message: error.message });
    }
  };

  const handleSaveTitle = async () => {
    try {
      await updateTask(task._id, { title });
    } catch (error) {
      setPermissionModal({ open: true, message: error.message });
    }
  };

  // Format creation date
  const formattedDate = task?.createdAt ? format(new Date(task.createdAt), 'MMMM dd, yyyy, p') : 'N/A';

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-end z-50" onClick={onClose}> {/* Overlay */}
      <div className="relative w-full md:w-1/3 lg:w-1/4 bg-secondary-bg-light dark:bg-secondary-bg-dark h-full shadow-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}> {/* Side Panel */}
        <div className="p-6">
          <div className="flex justify-end">
            {/* Close Button */}
            <button
              className="text-secondary-text-light hover:text-primary-text-light dark:text-secondary-text-dark dark:hover:text-primary-text-dark text-xl"
              onClick={onClose}
            >
              &times;
            </button>
          </div>

          {/* Title Section */}
          <div className="mt-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSaveTitle} // Save when input loses focus
              className="text-2xl font-bold text-primary-text-light dark:text-primary-text-dark w-full border-none outline-none focus:ring-0 bg-transparent"
              placeholder="Task Title"
            />
          </div>

          {/* Date Created */}
          <div className="mt-2 text-sm text-secondary-text-light dark:text-secondary-text-dark opacity-90">
            Date Created: {formattedDate}
          </div>

          {/* Priority Display */}
          {task?.priority && (
            <div className="mt-4">
              <h4 className="text-md font-medium text-primary-text-light dark:text-primary-text-dark mb-2">Priority</h4>
              <p className="text-sm text-secondary-text-light dark:text-secondary-text-dark opacity-90 capitalize">{task.priority}</p>
            </div>
          )}

          {/* Due Date Display */}
          {task?.dueDate && (
            <div className="mt-4">
              <h4 className="text-md font-medium text-primary-text-light dark:text-primary-text-dark mb-2">Due Date</h4>
              <p className="text-sm text-secondary-text-light dark:text-secondary-text-dark opacity-90">{new Date(task.dueDate).toLocaleDateString()}</p>
            </div>
          )}

          {/* Body/Description Section */}
          <div className="mt-6">
            <h4 className="text-md font-medium text-primary-text-light dark:text-primary-text-dark mb-2">Body</h4>
            {isEditingDescription ? (
              <div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border rounded bg-secondary-bg-light dark:bg-secondary-bg-dark border-gray-300 dark:border-gray-600 text-secondary-text-light dark:text-secondary-text-dark focus:outline-none focus:ring-2 focus:ring-accent-button-light dark:focus:ring-accent-button-dark"
                  placeholder="Add a detailed description..."
                  rows="10" // Increased rows for a body feel
                  autoFocus
                />
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    onClick={() => { setDescription(task?.description || ''); setIsEditingDescription(false); }}
                    className="px-3 py-1 text-sm text-secondary-text-light hover:text-primary-text-light dark:text-secondary-text-dark dark:hover:text-primary-text-dark"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveDescription}
                    className="px-3 py-1 text-sm bg-accent-button-light text-accent-button-text-light rounded hover:bg-accent-button-dark dark:bg-accent-button-dark dark:hover:bg-accent-button-light dark:text-accent-button-text-dark"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="text-sm text-secondary-text-light dark:text-secondary-text-dark opacity-90 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded whitespace-pre-wrap"
                onClick={() => setIsEditingDescription(true)}
              >
                {description || 'Add a detailed body...'}
              </div>
            )}
          </div>

          {/* Checklist Section */}
          {task?.checklist && task.checklist.length > 0 && (
            <div className="mt-6">
              <h4 className="text-md font-medium text-primary-text-light dark:text-primary-text-dark mb-2">Checklist</h4>
              <div className="space-y-2">
                {task.checklist.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      readOnly // Make it read-only in the detail view
                      className="rounded text-accent-button-light dark:text-accent-button-dark"
                    />
                    <span className={`text-sm text-secondary-text-light dark:text-secondary-text-dark opacity-90 ${item.completed ? 'line-through' : ''}`}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section Placeholder */}
          <div className="mt-6">
            <h4 className="text-md font-medium text-primary-text-light dark:text-primary-text-dark mb-2">Comments</h4>
            <div className="text-sm text-secondary-text-light dark:text-secondary-text-dark opacity-90">
              {/* Comment input and display will go here */}
              No comments yet.
            </div>
          </div>

          <PermissionModal open={permissionModal.open} onClose={() => setPermissionModal({ open: false, message: '' })} message={permissionModal.message} />
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal; 