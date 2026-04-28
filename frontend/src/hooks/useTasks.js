import { useState, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, in_progress: 0, completed: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
      const { data } = await api.get(`/tasks?${params.toString()}`);
      setTasks(data.tasks);
      setStats(data.stats);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch tasks';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (taskData) => {
    try {
      const { data } = await api.post('/tasks', taskData);
      setTasks((prev) => [data.task, ...prev]);
      setStats((s) => ({ ...s, total: s.total + 1, pending: s.pending + 1 }));
      toast.success('Task created!');
      return data.task;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create task';
      toast.error(msg);
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (id, taskData) => {
    try {
      const { data } = await api.put(`/tasks/${id}`, taskData);
      setTasks((prev) => prev.map((t) => (t.id === id ? data.task : t)));
      toast.success('Task updated!');
      return data.task;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update task';
      toast.error(msg);
      throw err;
    }
  }, []);

  const updateStatus = useCallback(async (id, status) => {
    try {
      const { data } = await api.patch(`/tasks/${id}/status`, { status });
      setTasks((prev) => prev.map((t) => (t.id === id ? data.task : t)));
      // Refresh stats
      fetchTasks();
      toast.success(`Marked as ${status.replace('_', ' ')}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  }, [fetchTasks]);

  const deleteTask = useCallback(async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setStats((s) => ({ ...s, total: s.total - 1 }));
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  }, []);

  return { tasks, stats, loading, error, fetchTasks, createTask, updateTask, updateStatus, deleteTask };
};
