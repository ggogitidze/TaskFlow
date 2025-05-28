import React, { useState, useEffect, useRef } from 'react';
import { boardApi } from '../utils/api';

const Chat = ({ socket, boardId, user }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch chat history on mount or boardId change
    let isMounted = true;
    const fetchChat = async () => {
      try {
        const res = await boardApi.getChat(boardId);
        if (isMounted) {
          // Normalize messages to match socket format
          setMessages(res.data.map(msg => ({
            user: { id: msg.user._id || msg.user.id, name: msg.user.name },
            message: msg.message,
            timestamp: msg.timestamp
          })));
        }
      } catch {
        setMessages([]);
      }
    };
    if (boardId) fetchChat();
    return () => { isMounted = false; };
  }, [boardId]);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (message) => {
      setMessages((prevMessages) => {
        // Avoid duplicate messages (by timestamp+user+message)
        if (prevMessages.some(m => m.timestamp === message.timestamp && m.user.id === message.user.id && m.message === message.message)) {
          return prevMessages;
        }
        return [...prevMessages, message];
    });
    };

    socket.on('chat-message', handleMessage);

    // Clean up the event listener on component unmount
    return () => {
      socket.off('chat-message', handleMessage);
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim() && socket && boardId && user) {
      socket.emit('chat-message', { boardId, message: input, user: { id: user._id, name: user.name } });
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[50vh] bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-300 dark:border-gray-600 shadow-md">
      <div className="mb-2">
        <span className="block w-full px-3 py-1 rounded-t-lg font-semibold text-white bg-accent-button-light dark:bg-accent-button-dark text-center">Team Chat</span>
      </div>
      <div className="flex-grow overflow-y-auto mb-2 space-y-2 text-secondary-text-light dark:text-secondary-text-dark scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-900 pr-1" style={{ fontSize: '0.95rem' }}>
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start ${msg.user.id === user._id ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-2 rounded-lg max-w-[80%] text-sm ${
              msg.user.id === user._id 
                ? 'bg-accent-button-light text-accent-button-text-light dark:bg-accent-button-dark dark:text-accent-button-text-dark self-end'
                : 'bg-gray-200 dark:bg-gray-700 text-secondary-text-light dark:text-secondary-text-dark'
              }`}>
              <span className="font-semibold block text-primary-text-light dark:text-primary-text-dark">{msg.user.name}:</span>
              {msg.message}
              <span className="block text-xs opacity-75 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow rounded-l-lg p-2 border-t border-b border-l border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-secondary-text-light dark:text-secondary-text-dark focus:outline-none focus:ring-2 focus:ring-accent-button-light dark:focus:ring-accent-button-dark text-sm"
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="bg-accent-button-light hover:bg-accent-button-dark text-white font-bold py-2 px-4 rounded-r-lg dark:bg-accent-button-dark dark:hover:bg-accent-button-light dark:text-white text-sm"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat; 