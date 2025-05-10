import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  background-color: var(--card-background);
  border-radius: 14px;
  box-shadow: 0 2px 4px var(--shadow-color);
  padding: 1.8rem;
  margin-bottom: 1.8rem;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 10px var(--shadow-color);
  }
`;

const CardTitle = styled.h2`
  color: var(--text-dark);
  font-size: 1.4rem;
  margin-bottom: 1.2rem;
  padding-bottom: 0.7rem;
  border-bottom: 1px solid var(--border-color);
  font-family: 'Google Sans', sans-serif;
  font-weight: 500;
`;

const Card = ({ title, children, className }) => {
  return (
    <CardContainer className={className}>
      {title && <CardTitle>{title}</CardTitle>}
      {children}
    </CardContainer>
  );
};

export default Card; 