import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Toast notifications state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const clearToast = () => {
    setToast(null);
  };

  // Perform a silent authentication check on startup
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        // Silent refresh/verification call to backend
        const res = await axiosInstance.post('/auth/refresh');
        if (res.data.success) {
          setUser(res.data.user);
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }
      } catch (err) {
        console.log('No active session found.');
        setUser(null);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = async (email, password, rememberMe = false) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post('/auth/login', { email, password, rememberMe });
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        showToast('Logged in successfully!', 'success');
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Invalid email or password.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post('/auth/register', { name, email, password });
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        showToast('Registration successful!', 'success');
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Email might already be taken.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await axiosInstance.post('/auth/logout');
      setUser(null);
      localStorage.removeItem('user');
      showToast('Logged out successfully.', 'success');
    } catch (err) {
      showToast('Error during logout.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (name, email, password) => {
    try {
      setLoading(true);
      const res = await axiosInstance.put('/user/profile', { name, email, password });
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        showToast('Profile updated successfully!', 'success');
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile details.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (settingsPayload) => {
    try {
      const res = await axiosInstance.put('/user/settings', settingsPayload);
      if (res.data.success) {
        // Sync setting changes with stored user state
        const updatedUser = { ...user, settings: res.data.settings };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        showToast('Preferences updated successfully!', 'success');
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save settings preferences.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const deleteAccount = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.delete('/user/account');
      if (res.data.success) {
        setUser(null);
        localStorage.removeItem('user');
        showToast('Account permanently deleted.', 'success');
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Account deletion failed.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        updateSettings,
        deleteAccount,
        toast,
        showToast,
        clearToast
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
