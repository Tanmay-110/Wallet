import React, { useState } from 'react';
import styled from 'styled-components';
import TransactionItem from './TransactionItem';
import EmptyState from './EmptyState';
import { FaExchangeAlt, FaFileInvoiceDollar, FaArrowUp } from 'react-icons/fa';

const TransactionsContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  padding: 0 0.5rem;
`;

const FilterTabs = styled.div`
  display: flex;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 1rem;
`;

const Tab = styled.button`
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  color: ${({ active }) => active ? 'var(--primary-color)' : 'var(--text-secondary)'};
  font-weight: ${({ active }) => active ? '600' : '400'};
  cursor: pointer;
  position: relative;
  font-family: 'Google Sans', sans-serif;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.4rem;
    font-size: 1rem;
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 3px;
    background-color: var(--primary-color);
    opacity: ${({ active }) => active ? '1' : '0'};
    transition: opacity 0.2s;
  }
  
  &:hover {
    color: var(--primary-color);
  }
`;

const TransactionsList = ({ transactions, onAcceptRequest, onRejectRequest }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  
  const filteredTransactions = sortedTransactions.filter(transaction => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'payments' && transaction.type === 'SEND') return true;
    if (activeFilter === 'requests' && transaction.type === 'REQUEST') return true;
    return false;
  });
  
  return (
    <div>
      <FilterTabs>
        <Tab 
          active={activeFilter === 'all'} 
          onClick={() => setActiveFilter('all')}
        >
          <FaExchangeAlt /> All
        </Tab>
        <Tab 
          active={activeFilter === 'payments'} 
          onClick={() => setActiveFilter('payments')}
        >
          <FaArrowUp /> Payments
        </Tab>
        <Tab 
          active={activeFilter === 'requests'} 
          onClick={() => setActiveFilter('requests')}
        >
          <FaFileInvoiceDollar /> Requests
        </Tab>
      </FilterTabs>
      
      <TransactionsContainer>
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map(transaction => (
            <TransactionItem 
              key={transaction._id} 
              transaction={transaction}
              onAccept={onAcceptRequest}
              onReject={onRejectRequest}
            />
          ))
        ) : (
          <EmptyState 
            icon={<FaExchangeAlt />}
            title="No transactions yet"
            message="Your transactions will appear here once you send or receive money."
          />
        )}
      </TransactionsContainer>
    </div>
  );
};

export default TransactionsList; 