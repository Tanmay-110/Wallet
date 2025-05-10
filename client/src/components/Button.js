import React from 'react';
import styled, { css } from 'styled-components';

const ButtonBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.85rem 1.7rem;
  border-radius: 24px;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  outline: none;
  font-family: 'Google Sans', sans-serif;
  letter-spacing: 0.25px;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  svg {
    margin-right: 0.75rem;
    font-size: 1.1rem;
  }
`;

const PrimaryButton = styled.button`
  ${ButtonBase}
  background-color: var(--primary-color);
  color: white;
  box-shadow: 0 1px 2px var(--shadow-color);
  
  &:hover:not(:disabled) {
    background-color: var(--primary-hover);
    box-shadow: 0 2px 4px var(--shadow-color);
    transform: translateY(-1px);
  }
`;

const SecondaryButton = styled.button`
  ${ButtonBase}
  background-color: white;
  color: var(--primary-color);
  border: 1px solid var(--border-color);
  
  &:hover:not(:disabled) {
    background-color: #f1f3f4;
    box-shadow: 0 1px 2px var(--shadow-color);
  }
`;

const DangerButton = styled.button`
  ${ButtonBase}
  background-color: var(--danger-color);
  color: white;
  box-shadow: 0 1px 2px var(--shadow-color);
  
  &:hover:not(:disabled) {
    background-color: #d93025;
    box-shadow: 0 2px 4px var(--shadow-color);
    transform: translateY(-1px);
  }
`;

const SuccessButton = styled.button`
  ${ButtonBase}
  background-color: var(--secondary-color);
  color: white;
  box-shadow: 0 1px 2px var(--shadow-color);
  
  &:hover:not(:disabled) {
    background-color: #188038;
    box-shadow: 0 2px 4px var(--shadow-color);
    transform: translateY(-1px);
  }
`;

const TextButton = styled.button`
  ${ButtonBase}
  background-color: transparent;
  color: var(--primary-color);
  padding: 0.5rem 1rem;
  
  &:hover:not(:disabled) {
    background-color: rgba(26, 115, 232, 0.1);
  }
`;

const Button = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  size = 'medium',
  ...props 
}) => {
  let ButtonComponent;
  
  switch (variant) {
    case 'secondary':
      ButtonComponent = SecondaryButton;
      break;
    case 'danger':
      ButtonComponent = DangerButton;
      break;
    case 'success':
      ButtonComponent = SuccessButton;
      break;
    case 'text':
      ButtonComponent = TextButton;
      break;
    default:
      ButtonComponent = PrimaryButton;
  }
  
  // Size adjustments
  let sizeStyles = {};
  if (size === 'small') {
    sizeStyles = { padding: '0.6rem 1.2rem', fontSize: '0.9rem' };
  } else if (size === 'large') {
    sizeStyles = { padding: '1.1rem 2.2rem', fontSize: '1.15rem' };
  }
  
  return (
    <ButtonComponent 
      style={{ 
        ...(fullWidth ? { width: '100%' } : {}),
        ...sizeStyles
      }} 
      {...props}
    >
      {children}
    </ButtonComponent>
  );
};

export default Button; 