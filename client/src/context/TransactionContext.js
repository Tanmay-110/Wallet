import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const TransactionContext = createContext();

export const useTransactions = () => useContext(TransactionContext);

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { updateUserBalance } = useAuth();
  const lastFetchRef = useRef(0);

  // Get all transactions
  const getTransactions = useCallback(async (filters = {}) => {
    // Throttle API calls to prevent excessive requests
    const now = Date.now();
    if (now - lastFetchRef.current < 2000) {
      // Use a ref to access current transactions value without dependency
      return transactions;
    }
    
    setLoading(true);
    setError(null);
    lastFetchRef.current = now;
    
    try {
      let queryParams = new URLSearchParams();
      
      // Add filters to query params
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.status) queryParams.append('status', filters.status);
      
      const response = await axios.get(`/api/transactions?${queryParams.toString()}`);
      
      if (response.data.success) {
        setTransactions(response.data.data.transactions);
        return response.data.data.transactions;
      } else {
        setError(response.data.message || 'Failed to fetch transactions');
        return [];
      }
    } catch (error) {
      const message = error.response?.data?.message || 'An error occurred while fetching transactions';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Send money to another user
  const sendMoney = async (receiverId, amount, description) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/transactions/send', { 
        receiverId, 
        amount: parseFloat(amount), 
        description 
      });
      
      if (response.data.success) {
        // Update local transactions list
        await getTransactions();
        // Update user's wallet balance
        updateUserBalance(response.data.data.senderBalance);
        return { success: true, data: response.data.data };
      } else {
        setError(response.data.message || 'Failed to send money');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'An error occurred while sending money';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Request money from another user
  const requestMoney = async (payerId, amount, description) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/transactions/request', { 
        payerId, 
        amount: parseFloat(amount), 
        description 
      });
      
      if (response.data.success) {
        // Update local transactions list
        await getTransactions();
        return { success: true, data: response.data.data };
      } else {
        setError(response.data.message || 'Failed to request money');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'An error occurred while requesting money';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Respond to a money request (accept or reject)
  const respondToRequest = async (transactionId, action) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`/api/transactions/${transactionId}/respond`, { action });
      
      if (response.data.success) {
        // Update local transactions list
        await getTransactions();
        // If accepted, update user's wallet balance
        if (action === 'ACCEPT') {
          updateUserBalance(response.data.data.senderBalance);
        }
        return { success: true, data: response.data.data };
      } else {
        setError(response.data.message || 'Failed to respond to request');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'An error occurred while responding to the request';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Find users for sending/requesting money
  const findUsers = async (search = '') => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/transactions/users?search=${search}`);
      
      if (response.data.success) {
        return { success: true, users: response.data.data.users };
      } else {
        return { success: false, users: [] };
      }
    } catch (error) {
      return { success: false, users: [] };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    transactions,
    loading,
    error,
    getTransactions,
    sendMoney,
    requestMoney,
    respondToRequest,
    findUsers
  };

  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>;
}; 