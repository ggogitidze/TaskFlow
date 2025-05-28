import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Board related API calls
export const boardApi = {
  getAll: () => api.get('/boards'),
  getOne: (id) => api.get(`/boards/${id}`),
  create: (data) => api.post('/boards', data),
  update: (id, data) => api.put(`/boards/${id}`, data),
  delete: (id) => api.delete(`/boards/${id}`),
  getChat: (id) => api.get(`/boards/${id}/chat`)
};

// Task related API calls
export const taskApi = {
  create: (boardId, data) => api.post(`/boards/${boardId}/tasks`, data),
  update: (boardId, taskId, data) => api.put(`/boards/${boardId}/tasks/${taskId}`, data),
  delete: (boardId, taskId) => api.delete(`/boards/${boardId}/tasks/${taskId}`),
  move: (boardId, taskId, data) => api.put(`/boards/${boardId}/tasks/${taskId}/move`, data)
};

// Auth related API calls
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  validate: () => api.get('/auth/validate'),
  register: (credentials) => api.post('/auth/register', credentials)
}; 

// Invite related API calls
export const inviteApi = {
  sendInvite: (data) => api.post('/invites', data),
  getInvites: () => api.get('/invites'),
  acceptInvite: (inviteId) => api.post(`/invites/${inviteId}/accept`),
  rejectInvite: (inviteId) => api.post(`/invites/${inviteId}/reject`)
}; 