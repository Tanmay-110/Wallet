import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaWallet, FaSignOutAlt, FaUserCircle, FaTachometerAlt, FaPaperPlane, FaHandHoldingUsd, FaHistory, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const NavContainer = styled.nav`
  background-color: var(--background-light);
  padding: 1rem 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  font-size: 1.7rem;
  font-weight: 700;
  font-family: 'Google Sans', sans-serif;
  color: var(--primary-color);
  text-decoration: none;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  svg {
    margin-right: 0.5rem;
    color: var(--primary-color);
    font-size: 1.8rem;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
    
    svg {
      font-size: 1.6rem;
    }
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 1024px) {
    position: fixed;
    top: 0;
    right: ${({ isOpen }) => (isOpen ? '0' : '-100%')};
    width: 280px;
    height: 100vh;
    background-color: var(--background-light);
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 5rem 2rem 2rem;
    transition: right 0.3s ease;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    overflow-y: auto;
  }
`;

const NavLink = styled(Link)`
  color: ${({ isActive }) => isActive ? 'var(--primary-color)' : 'var(--text-secondary)'};
  margin-left: 1.8rem;
  text-decoration: none;
  font-weight: 500;
  font-family: 'Google Sans', sans-serif;
  font-size: 1rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: ${({ isActive }) => isActive ? '100%' : '0'};
    height: 2px;
    background-color: var(--primary-color);
    transition: width 0.2s ease;
  }

  &:hover {
    color: var(--primary-color);
    
    &:after {
      width: 100%;
    }
  }

  svg {
    margin-right: 0.5rem;
    font-size: 1.1rem;
  }

  @media (max-width: 1024px) {
    margin: 1rem 0;
    width: 100%;
    padding: 0.75rem 0;
    font-size: 1.1rem;
    
    &:first-child {
      margin-top: 0;
    }
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  color: var(--text-dark);
  margin-right: 1rem;
  font-family: 'Google Sans', sans-serif;
  font-size: 1.05rem;
  
  svg {
    margin-right: 0.5rem;
    color: var(--primary-color);
    font-size: 1.2rem;
  }

  @media (max-width: 1024px) {
    margin: 0 0 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--border-color);
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    
    svg {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }
  }
`;

const UserName = styled.span`
  @media (max-width: 1024px) {
    margin-bottom: 0.5rem;
    font-weight: 500;
    font-size: 1.1rem;
  }
`;

const Balance = styled.span`
  background: linear-gradient(135deg, var(--primary-color) 0%, #ec407a 100%);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  margin-left: 0.5rem;
  font-weight: 500;
  font-size: 1rem;
  box-shadow: 0 2px 5px rgba(240, 98, 146, 0.3);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 3px 8px rgba(240, 98, 146, 0.4);
  }

  @media (max-width: 1024px) {
    margin-left: 0;
    padding: 0.5rem 1rem;
    font-size: 1.1rem;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  margin-left: 1.8rem;
  font-size: 1rem;
  font-family: 'Google Sans', sans-serif;
  padding: 0;
  transition: color 0.2s;
  
  svg {
    margin-right: 0.5rem;
    color: var(--danger-color);
    font-size: 1.1rem;
  }
  
  &:hover {
    color: var(--danger-color);
  }

  @media (max-width: 1024px) {
    margin: 1rem 0 0;
    width: 100%;
    padding: 0.75rem 0;
    font-size: 1.1rem;
    justify-content: flex-start;
    border-top: 1px solid var(--border-color);
    padding-top: 1.5rem;
    
    svg {
      font-size: 1.2rem;
    }
  }
`;

const MenuToggle = styled.button`
  display: none;
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1001;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: 1024px) {
    display: block;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  z-index: 999;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <NavContainer>
      <NavContent>
        <Logo to="/">
          <FaWallet /> Digital Wallet
        </Logo>
        
        {isAuthenticated && (
          <MenuToggle onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </MenuToggle>
        )}
        
        <Overlay isOpen={isMenuOpen} onClick={closeMenu} />
        
        <NavLinks isOpen={isMenuOpen}>
          {isAuthenticated ? (
            <>
              <UserInfo>
                <FaUserCircle />
                <UserName>{user.firstName} {user.lastName}</UserName>
                <Balance>${user.walletBalance.toFixed(2)}</Balance>
              </UserInfo>
              <NavLink to="/" isActive={location.pathname === '/'} onClick={closeMenu}>
                <FaTachometerAlt /> Dashboard
              </NavLink>
              <NavLink to="/send" isActive={location.pathname === '/send'} onClick={closeMenu}>
                <FaPaperPlane /> Send Money
              </NavLink>
              <NavLink to="/request" isActive={location.pathname === '/request'} onClick={closeMenu}>
                <FaHandHoldingUsd /> Request Money
              </NavLink>
              <NavLink to="/transactions" isActive={location.pathname === '/transactions'} onClick={closeMenu}>
                <FaHistory /> Transactions
              </NavLink>
              <LogoutButton onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </LogoutButton>
            </>
          ) : (
            <>
              <NavLink to="/login" isActive={location.pathname === '/login'}>Login</NavLink>
              <NavLink to="/register" isActive={location.pathname === '/register'}>Register</NavLink>
            </>
          )}
        </NavLinks>
      </NavContent>
    </NavContainer>
  );
};

export default Navbar; 