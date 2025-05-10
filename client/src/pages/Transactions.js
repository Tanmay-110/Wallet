import React, { useEffect } from 'react';
import styled from 'styled-components';
import { FaHistory } from 'react-icons/fa';
import Card from '../components/Card';
import TransactionsList from '../components/TransactionsList';
import { useTransactions } from '../context/TransactionContext';

const TransactionsContainer = styled.div`
  padding: 1rem 0;
`;

const PageTitle = styled.h1`
  margin-bottom: 1.5rem;
  color: var(--text-dark);
  display: flex;
  align-items: center;
  font-family: 'Google Sans', sans-serif;
  font-weight: 500;
  font-size: 1.8rem;
  
  svg {
    margin-right: 0.5rem;
    color: var(--primary-color);
  }
`;

const TransactionsCard = styled(Card)`
  margin-bottom: 2rem;
  overflow: hidden;
`;

const Transactions = () => {
  const { transactions, getTransactions, respondToRequest } = useTransactions();
  
  // Load transactions when component mounts
  useEffect(() => {
    const loadTransactions = async () => {
      await getTransactions();
    };
    
    loadTransactions();
  }, [getTransactions]);
  
  const handleAcceptRequest = async (transactionId) => {
    await respondToRequest(transactionId, 'ACCEPT');
  };
  
  const handleRejectRequest = async (transactionId) => {
    await respondToRequest(transactionId, 'REJECT');
  };
  
  return (
    <TransactionsContainer>
      <PageTitle>
        <FaHistory /> Transaction History
      </PageTitle>
      
      <TransactionsCard>
        <TransactionsList 
          transactions={transactions}
          onAcceptRequest={handleAcceptRequest}
          onRejectRequest={handleRejectRequest}
        />
      </TransactionsCard>
    </TransactionsContainer>
  );
};

export default Transactions; 