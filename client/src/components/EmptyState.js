import React from 'react';
import styled from 'styled-components';

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
`;

const IconWrapper = styled.div`
  font-size: 3rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  opacity: 0.6;
  
  svg {
    filter: grayscale(0.5);
  }
`;

const Title = styled.h3`
  font-family: 'Google Sans', sans-serif;
  font-size: 1.4rem;
  color: var(--text-dark);
  margin-bottom: 0.75rem;
  font-weight: 500;
`;

const Message = styled.p`
  color: var(--text-secondary);
  font-size: 1rem;
  max-width: 300px;
  line-height: 1.5;
`;

const EmptyState = ({ icon, title, message, children }) => {
  return (
    <EmptyStateContainer>
      <IconWrapper>
        {icon}
      </IconWrapper>
      <Title>{title}</Title>
      <Message>{message}</Message>
      {children}
    </EmptyStateContainer>
  );
};

export default EmptyState; 