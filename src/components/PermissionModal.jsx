import React from 'react';

const PermissionModal = ({ open, onClose, message }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-96 relative" onClick={e => e.stopPropagation()}>
        <button className="absolute top-2 right-2 text-xl text-gray-700 dark:text-gray-200 hover:text-red-500" onClick={onClose}>&times;</button>
        <h2 className="text-lg font-semibold mb-4 text-red-600 dark:text-red-400">Permission Denied</h2>
        <div className="text-gray-800 dark:text-gray-100 mb-4">{message}</div>
        <button
          onClick={onClose}
          className="w-full py-2 rounded bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PermissionModal; 