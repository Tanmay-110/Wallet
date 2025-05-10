import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaPaperPlane, FaSearch, FaMoneyBillWave, FaAlignLeft, FaCheck, FaTimes } from 'react-icons/fa';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { useTransactions } from '../context/TransactionContext';

const SendMoneyContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem 0;
`;

const PageTitle = styled.h1`
  margin-bottom: 1.5rem;
  color: var(--text-light);
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
    color: var(--primary-color);
  }
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 1rem;
  
  svg {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
  }
  
  input {
    padding-left: 2.5rem;
  }
`;

const UserListContainer = styled.div`
  margin-top: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
  background-color: var(--input-background);
  border: 1px solid var(--border-color);
  border-radius: 6px;
`;

const UserItem = styled.div`
  padding: 0.75rem;
  cursor: pointer;
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--primary-color);
    color: white;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const UserInfo = styled.div`
  display: flex;
  justify-content: space-between;
`;

const UserName = styled.div`
  font-weight: 500;
`;

const UserEmail = styled.div`
  font-size: 0.8rem;
  color: var(--text-muted);
`;

const SelectedUserCard = styled.div`
  background-color: var(--card-background);
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SelectedUserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: var(--danger-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  
  svg {
    margin-left: 0.25rem;
  }
`;

const ErrorMessage = styled.div`
  background-color: rgba(239, 68, 68, 0.2);
  color: var(--danger-color);
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.div`
  background-color: rgba(16, 185, 129, 0.2);
  color: var(--secondary-color);
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
  }
`;

const SendMoney = () => {
  const [search, setSearch] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { findUsers, sendMoney, loading } = useTransactions();
  const navigate = useNavigate();
  
  // Search for users when the search term changes
  useEffect(() => {
    const searchUsers = async () => {
      if (search.trim().length < 1) {
        setUsers([]);
        return;
      }
      
      const result = await findUsers(search);
      if (result.success) {
        setUsers(result.users);
      }
    };
    
    const timer = setTimeout(() => {
      searchUsers();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [search, findUsers]);
  
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSearch('');
    setUsers([]);
  };
  
  const clearSelectedUser = () => {
    setSelectedUser(null);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset states
    setError('');
    setSuccess('');
    setFormSubmitted(true);
    
    // Validation
    if (!selectedUser) {
      setError('Please select a recipient');
      setFormSubmitted(false);
      return;
    }
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      setFormSubmitted(false);
      return;
    }
    
    // Send money
    const result = await sendMoney(selectedUser._id, parseFloat(amount), description);
    
    if (result.success) {
      setSuccess(`Successfully sent $${parseFloat(amount).toFixed(2)} to ${selectedUser.firstName} ${selectedUser.lastName}`);
      
      // Reset form
      setSelectedUser(null);
      setAmount('');
      setDescription('');
      
      // Navigate to dashboard after a delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } else {
      setError(result.message || 'Failed to send money');
    }
    
    setFormSubmitted(false);
  };
  
  return (
    <SendMoneyContainer>
      <PageTitle>
        <FaPaperPlane /> Send Money
      </PageTitle>
      
      <Card>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && (
          <SuccessMessage>
            <FaCheck /> {success}
          </SuccessMessage>
        )}
        
        <form onSubmit={handleSubmit}>
          {!selectedUser ? (
            <>
              <InputGroup>
                <FaSearch />
                <Input
                  type="text"
                  id="search"
                  placeholder="Search by name or email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </InputGroup>
              
              {users.length > 0 && (
                <UserListContainer>
                  {users.map(user => (
                    <UserItem key={user._id} onClick={() => handleUserSelect(user)}>
                      <UserInfo>
                        <UserName>{user.firstName} {user.lastName}</UserName>
                      </UserInfo>
                      <UserEmail>{user.email}</UserEmail>
                    </UserItem>
                  ))}
                </UserListContainer>
              )}
            </>
          ) : (
            <SelectedUserCard>
              <SelectedUserInfo>
                <UserName>{selectedUser.firstName} {selectedUser.lastName}</UserName>
                <UserEmail>{selectedUser.email}</UserEmail>
              </SelectedUserInfo>
              <ClearButton type="button" onClick={clearSelectedUser}>
                Change <FaTimes />
              </ClearButton>
            </SelectedUserCard>
          )}
          
          <InputGroup>
            <FaMoneyBillWave />
            <Input
              type="number"
              id="amount"
              placeholder="Amount"
              step="0.01"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </InputGroup>
          
          <InputGroup>
            <FaAlignLeft />
            <Input
              as="textarea"
              id="description"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ minHeight: '100px', paddingLeft: '2.5rem' }}
            />
          </InputGroup>
          
          <Button 
            type="submit" 
            fullWidth
            disabled={loading || formSubmitted || !selectedUser}
          >
            {loading ? 'Processing...' : 'Send Money'}
          </Button>
        </form>
      </Card>
    </SendMoneyContainer>
  );
};

export default SendMoney; 