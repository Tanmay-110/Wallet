import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaEnvelope, FaLock, FaUser, FaUserPlus } from 'react-icons/fa';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const RegisterContainer = styled.div`
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

const SuccessMessage = styled.div`
  background-color: rgba(16, 185, 129, 0.2);
  color: var(--secondary-color);
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const LoginText = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  color: var(--text-muted);
  
  a {
    color: var(--primary-color);
    font-weight: 500;
  }
`;

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset errors and success state
    setFormError('');
    setSuccess(false);
    
    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setFormError('Please fill in all required fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }
    
    // Register the user
    const result = await register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    });
    
    if (result.success) {
      setSuccess(true);
      // Clear the form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      
      // Navigate to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setFormError(result.message || 'Registration failed');
    }
  };
  
  return (
    <RegisterContainer>
      <FormTitle>
        <FaUserPlus /> Create an Account
      </FormTitle>
      
      <Card>
        {formError && <ErrorMessage>{formError}</ErrorMessage>}
        {success && (
          <SuccessMessage>
            Registration successful! Redirecting you to login...
          </SuccessMessage>
        )}
        
        <form onSubmit={handleSubmit}>
          <FormRow>
            <InputIcon>
              <FaUser />
              <Input
                type="text"
                id="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </InputIcon>
            
            <InputIcon>
              <FaUser />
              <Input
                type="text"
                id="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </InputIcon>
          </FormRow>
          
          <InputIcon>
            <FaEnvelope />
            <Input
              type="email"
              id="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </InputIcon>
          
          <InputIcon>
            <FaLock />
            <Input
              type="password"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </InputIcon>
          
          <InputIcon>
            <FaLock />
            <Input
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </InputIcon>
          
          <Button 
            type="submit" 
            fullWidth
            disabled={loading || success}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </Button>
        </form>
        
        <LoginText>
          Already have an account? <Link to="/login">Login here</Link>
        </LoginText>
      </Card>
    </RegisterContainer>
  );
};

export default Register; 