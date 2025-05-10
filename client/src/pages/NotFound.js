import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';
import Button from '../components/Button';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 60vh;
  padding: 2rem;
`;

const ErrorIcon = styled.div`
  font-size: 6rem;
  color: var(--primary-color);
  margin-bottom: 2rem;
`;

const NotFoundTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--text-light);
`;

const NotFoundMessage = styled.p`
  font-size: 1.25rem;
  color: var(--text-muted);
  margin-bottom: 2rem;
  max-width: 600px;
`;

const HomeButton = styled(Button)`
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
  }
`;

const NotFound = () => {
  return (
    <NotFoundContainer>
      <ErrorIcon>
        <FaExclamationTriangle />
      </ErrorIcon>
      <NotFoundTitle>404 Not Found</NotFoundTitle>
      <NotFoundMessage>
        Oops! The page you're looking for doesn't exist or has been moved.
      </NotFoundMessage>
      <HomeButton as={Link} to="/">
        <FaHome /> Back to Dashboard
      </HomeButton>
    </NotFoundContainer>
  );
};

export default NotFound; 