import React from 'react';
import styled from 'styled-components';

const InputContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-light);
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background-color: var(--input-background);
  color: var(--text-light);
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
  
  &:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(109, 40, 217, 0.25);
  }
  
  &::placeholder {
    color: var(--text-muted);
  }
`;

const ErrorText = styled.div`
  color: var(--danger-color);
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

const Input = ({ 
  label, 
  id, 
  error, 
  ...props 
}) => {
  return (
    <InputContainer>
      {label && <Label htmlFor={id}>{label}</Label>}
      <StyledInput id={id} {...props} />
      {error && <ErrorText>{error}</ErrorText>}
    </InputContainer>
  );
};

export default Input; 