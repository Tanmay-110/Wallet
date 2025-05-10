import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const LoginContainer = styled.div`
  max-width: 500px;
  margin: 2rem auto;
`;

const FormTitle = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: var(--text-light);
`;

const ErrorMessage = styled.div`
  background-color: rgba(239, 68, 68, 0.2);
  color: var(--danger-color);
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const InputIcon = styled.div`
  position: relative;
  
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

const SignupText = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  color: var(--text-muted);
  
  a {
    color: var(--primary-color);
    font-weight: 500;
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setFormError('Please fill in all fields');
      return;
    }
    
    // Clear any previous errors
    setFormError('');
    
    const result = await login(email, password);
    
    if (result.success) {
      navigate('/');
    } else {
      setFormError(result.message || 'Login failed');
    }
  };
  
  return (
    <LoginContainer>
      <FormTitle>
        <FaUser /> Login to your wallet
      </FormTitle>
      
      <Card>
        {formError && <ErrorMessage>{formError}</ErrorMessage>}
        
        <form onSubmit={handleSubmit}>
          <InputIcon>
            <FaEnvelope />
            <Input
              type="email"
              id="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputIcon>
          
          <InputIcon>
            <FaLock />
            <Input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputIcon>
          
          <Button 
            type="submit" 
            fullWidth
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        
        <SignupText>
          Don't have an account? <Link to="/register">Sign up now</Link>
        </SignupText>
      </Card>
    </LoginContainer>
  );
};

export default Login; 