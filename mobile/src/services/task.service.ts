import api from './api';
import { Task, CreateTaskInput, UpdateTaskInput } from '../types/task';

export const taskService = {
  getTasks: async (params?: { status?: string; search?: string }) => {
    const response = await api.get('/tasks', { params });
    return response.data;
  },
  getTask: async (id: string) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },
  createTask: async (data: CreateTaskInput) => {
    const response = await api.post('/tasks', data);
    return response.data;
  },
  updateTask: async (id: string, data: UpdateTaskInput) => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },
  updateStatus: async (id: string, status: string) => {
    const response = await api.patch(`/tasks/${id}/status`, { status });
    return response.data;
  },
  deleteTask: async (id: string) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};
