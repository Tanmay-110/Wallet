import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define logout first before using it in fetchUserProfile
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  }, []);

  // Create a stable fetchUserProfile function with useCallback
  const fetchUserProfile = useCallback(async (token) => {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get('/api/users/profile');
      if (response.data.success) {
        setUser(response.data.data);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  // Check if user is already logged in (token exists)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile(token);
    } else {
      setLoading(false);
    }
  }, [fetchUserProfile]);

  // Configure axios to always include the token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Login attempt with:', { email, password });
      
      const response = await axios.post('/api/users/login', 
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      if (response.data.success) {
        const userData = response.data.data;
        localStorage.setItem('token', userData.token);
        // Set the authorization header immediately after login
        axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
        setUser(userData);
        return { success: true };
      } else {
        setError(response.data.message || 'Login failed');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'An error occurred during login';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Registration attempt with:', { ...userData, password: '***' });
      
      const response = await axios.post(
        '/api/users/register', 
        userData,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      if (response.data.success) {
        console.log('Registration successful');
        return { success: true };
      } else {
        console.log('Registration failed:', response.data);
        setError(response.data.message || 'Registration failed');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Response data:', error.response?.data);
      const message = error.response?.data?.message || 'An error occurred during registration';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const updateUserBalance = (newBalance) => {
    if (user) {
      setUser({ ...user, walletBalance: newBalance });
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUserBalance,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 