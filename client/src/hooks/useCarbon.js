import { useState, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from './useAuth';

export const useCarbon = () => {
  const { showToast } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [latestRecord, setLatestRecord] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalEntries: 0
  });

  // Calculate carbon without saving
  const calculateOnly = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.post('/carbon/calculate', formData);
      if (res.data.success) {
        setLatestRecord(res.data.data);
        return { success: true, data: res.data.data };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Error running carbon calculations.';
      setError(msg);
      showToast(msg, 'error');
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // Calculate and save footprint entry to database
  const saveFootprint = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.post('/carbon/save', formData);
      if (res.data.success) {
        showToast('Carbon entry saved successfully to history!', 'success');
        return { success: true, data: res.data.data };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save carbon footprint entry.';
      setError(msg);
      showToast(msg, 'error');
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // Fetch paginated carbon entries history list
  const fetchHistory = useCallback(async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.get(`/carbon/history?page=${page}&limit=${limit}`);
      if (res.data.success) {
        setEntries(res.data.data);
        setPagination(res.data.pagination);
        return { success: true, data: res.data.data };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to retrieve carbon history records.';
      setError(msg);
      showToast(msg, 'error');
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Fetch details of a single carbon entry by ID
  const fetchEntryById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.get(`/carbon/history/${id}`);
      if (res.data.success) {
        return { success: true, data: res.data.data };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load carbon entry details.';
      setError(msg);
      showToast(msg, 'error');
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // Delete a carbon entry
  const deleteRecord = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.delete(`/carbon/${id}`);
      if (res.data.success) {
        showToast('Record deleted successfully.', 'success');
        
        // Remove from local list state dynamically
        setEntries((prev) => prev.filter((entry) => entry._id !== id));
        
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete carbon entry.';
      setError(msg);
      showToast(msg, 'error');
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  return {
    entries,
    loading,
    error,
    latestRecord,
    pagination,
    setLatestRecord,
    calculateOnly,
    saveFootprint,
    fetchHistory,
    fetchEntryById,
    deleteRecord
  };
};

export default useCarbon;
