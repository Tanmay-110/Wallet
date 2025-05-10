import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaMoneyBillWave, FaArrowRight, FaPaperPlane, FaHandHoldingUsd, FaHistory } from 'react-icons/fa';
import Card from '../components/Card';
import Button from '../components/Button';
import TransactionItem from '../components/TransactionItem';
import { useAuth } from '../context/AuthContext';
import { useTransactions } from '../context/TransactionContext';
import EmptyState from '../components/EmptyState';

const DashboardContainer = styled.div`
  padding: 1.5rem 0;
`;

const WelcomeSection = styled.div`
  margin-bottom: 2rem;
`;

const WelcomeTitle = styled.h1`
  margin-bottom: 0.5rem;
  color: var(--text-dark);
  font-size: 2rem;
  font-family: 'Google Sans', sans-serif;
  font-weight: 500;
`;

const WelcomeSubtitle = styled.p`
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
`;

const BalanceCard = styled(Card)`
  background: linear-gradient(135deg, var(--primary-color) 0%, #ec407a 100%);
  color: white;
  border-radius: 16px;
  padding: 1.8rem;
  box-shadow: 0 4px 10px rgba(240, 98, 146, 0.3);
`;

const BalanceAmount = styled.div`
  font-size: 3rem;
  font-weight: 500;
  margin: 1rem 0;
  font-family: 'Google Sans', sans-serif;
`;

const BalanceLabel = styled.div`
  font-size: 1.2rem;
  opacity: 0.9;
  font-family: 'Google Sans', sans-serif;
`;

const ActionButtonsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ActionButton = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--card-background);
  color: var(--text-dark);
  padding: 1.5rem;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px var(--shadow-color);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px var(--shadow-color);
    background-color: #f1f3f4;
  }
  
  svg {
    font-size: 1.75rem;
    margin-bottom: 0.75rem;
    color: var(--primary-color);
  }
`;

const ActionButtonText = styled.span`
  font-weight: 500;
  font-family: 'Google Sans', sans-serif;
  font-size: 1.1rem;
`;

const SectionTitle = styled.h2`
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  color: var(--text-dark);
  font-family: 'Google Sans', sans-serif;
  font-weight: 500;
  font-size: 1.5rem;
  
  svg {
    margin-right: 0.5rem;
    color: var(--primary-color);
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ViewAllLink = styled(Link)`
  display: flex;
  align-items: center;
  color: var(--primary-color);
  font-size: 1rem;
  font-family: 'Google Sans', sans-serif;
  
  svg {
    margin-left: 0.25rem;
  }
`;

const TransactionsSection = styled.div`
  background-color: var(--card-background);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 1px 3px var(--shadow-color);
`;

const LoadingText = styled.p`
  text-align: center;
  padding: 1.5rem;
  color: var(--text-secondary);
`;

const Dashboard = () => {
  const { user } = useAuth();
  const { getTransactions, transactions, loading, respondToRequest } = useTransactions();
  const [recentTransactions, setRecentTransactions] = useState([]);
  
  useEffect(() => {
    const loadTransactions = async () => {
      await getTransactions();
    };
    
    loadTransactions();
  }, [getTransactions]);
  
  useEffect(() => {
    // Store user ID in localStorage for transaction component to use
    if (user && user._id) {
      localStorage.setItem('userId', user._id);
    }
    
    // Get recent transactions and sort by date (newest first)
    if (transactions.length > 0) {
      const sorted = [...transactions].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setRecentTransactions(sorted.slice(0, 5));
    }
  }, [transactions, user]);
  
  const handleAccept = async (transactionId) => {
    await respondToRequest(transactionId, 'ACCEPT');
  };
  
  const handleReject = async (transactionId) => {
    await respondToRequest(transactionId, 'REJECT');
  };
  
  return (
    <DashboardContainer>
      <WelcomeSection>
        <WelcomeTitle>Hi, {user?.firstName}!</WelcomeTitle>
        <WelcomeSubtitle>Manage your money with ease</WelcomeSubtitle>
        
        <BalanceCard>
          <BalanceLabel>Available Balance</BalanceLabel>
          <BalanceAmount>${user?.walletBalance?.toFixed(2) || '0.00'}</BalanceAmount>
          <Button as={Link} to="/transactions" variant="secondary">
            View Transaction History
          </Button>
        </BalanceCard>
      </WelcomeSection>
      
      <ActionButtonsContainer>
        <ActionButton to="/send">
          <FaPaperPlane />
          <ActionButtonText>Send Money</ActionButtonText>
        </ActionButton>
        <ActionButton to="/request">
          <FaHandHoldingUsd />
          <ActionButtonText>Request Money</ActionButtonText>
        </ActionButton>
      </ActionButtonsContainer>
      
      <SectionHeader>
        <SectionTitle>
          <FaHistory /> Recent Activity
        </SectionTitle>
        <ViewAllLink to="/transactions">
          View All <FaArrowRight />
        </ViewAllLink>
      </SectionHeader>
      
      {loading ? (
        <TransactionsSection>
          <LoadingText>Loading transactions...</LoadingText>
        </TransactionsSection>
      ) : recentTransactions.length > 0 ? (
        <TransactionsSection>
          {recentTransactions.map((transaction) => (
            <TransactionItem 
              key={transaction._id} 
              transaction={transaction}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          ))}
        </TransactionsSection>
      ) : (
        <EmptyState
          icon={<FaMoneyBillWave />}
          title="No transactions yet"
          message="Start sending or requesting money to see your activity here"
        />
      )}
    </DashboardContainer>
  );
};

export default Dashboard; 