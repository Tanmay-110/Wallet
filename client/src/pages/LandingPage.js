import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaWallet, FaMoneyBillWave, FaUserFriends, FaShieldAlt, FaMobileAlt, FaRegCreditCard } from 'react-icons/fa';

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const HeroSection = styled.div`
  background: linear-gradient(135deg, var(--primary-color) 0%, #ec407a 100%);
  color: white;
  padding: 5rem 2rem;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: 'Google Sans', sans-serif;
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  max-width: 800px;
  margin: 0 auto 2rem;
  opacity: 0.9;
  line-height: 1.6;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
  }
`;

const HeroButton = styled(Link)`
  padding: 1rem 2.5rem;
  font-size: 1.2rem;
  font-weight: 500;
  border-radius: 50px;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;
  font-family: 'Google Sans', sans-serif;
  
  &.primary {
    background-color: white;
    color: var(--primary-color);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }
  }
  
  &.secondary {
    background-color: transparent;
    color: white;
    border: 2px solid white;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      transform: translateY(-3px);
    }
  }
`;

const FeaturesSection = styled.div`
  padding: 5rem 2rem;
  background-color: var(--background-off-white);
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: var(--text-dark);
  font-family: 'Google Sans', sans-serif;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 2.5rem 2rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  color: var(--primary-color);
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--text-dark);
  font-family: 'Google Sans', sans-serif;
`;

const FeatureDescription = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
`;

const CTASection = styled.div`
  background-color: #f5f5f5;
  padding: 5rem 2rem;
  text-align: center;
`;

const CTATitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: var(--text-dark);
  font-family: 'Google Sans', sans-serif;
`;

const CTADescription = styled.p`
  max-width: 700px;
  margin: 0 auto 2rem;
  color: var(--text-secondary);
  font-size: 1.2rem;
  line-height: 1.6;
`;

const Footer = styled.footer`
  background-color: var(--text-dark);
  color: white;
  padding: 3rem 2rem;
  text-align: center;
  margin-top: auto;
`;

const FooterText = styled.p`
  opacity: 0.8;
  margin-bottom: 1rem;
`;

const LandingPage = () => {
  return (
    <PageContainer>
      <HeroSection>
        <HeroTitle>
          <FaWallet /> Digital Wallet
        </HeroTitle>
        <HeroSubtitle>
          The simplest way to send, request, and manage your money online. Fast, secure, and user-friendly.
        </HeroSubtitle>
        <ButtonContainer>
          <HeroButton to="/register" className="primary">Get Started</HeroButton>
          <HeroButton to="/login" className="secondary">Login</HeroButton>
        </ButtonContainer>
      </HeroSection>
      
      <FeaturesSection>
        <SectionTitle>What We Offer</SectionTitle>
        <FeatureGrid>
          <FeatureCard>
            <FeatureIcon>
              <FaMoneyBillWave />
            </FeatureIcon>
            <FeatureTitle>Send & Receive Money</FeatureTitle>
            <FeatureDescription>
              Instantly transfer money to friends, family, or businesses with just a few clicks. No long waiting periods.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <FaUserFriends />
            </FeatureIcon>
            <FeatureTitle>Request Money</FeatureTitle>
            <FeatureDescription>
              Need someone to pay you back? Send money requests easily and keep track of all your pending transactions.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <FaRegCreditCard />
            </FeatureIcon>
            <FeatureTitle>Transaction History</FeatureTitle>
            <FeatureDescription>
              View your complete transaction history with detailed information about every payment and request.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <FaMobileAlt />
            </FeatureIcon>
            <FeatureTitle>Mobile Friendly</FeatureTitle>
            <FeatureDescription>
              Access your wallet on the go! Our platform is fully responsive and works perfectly on mobile devices.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <FaShieldAlt />
            </FeatureIcon>
            <FeatureTitle>Secure Transactions</FeatureTitle>
            <FeatureDescription>
              Your security is our priority. All transactions are encrypted and protected with industry-standard security measures.
            </FeatureDescription>
          </FeatureCard>
        </FeatureGrid>
      </FeaturesSection>
      
      <CTASection>
        <CTATitle>Ready to simplify your financial life?</CTATitle>
        <CTADescription>
          Join thousands of users who are already enjoying the convenience of Digital Wallet.
          Sign up today and get started with your new wallet!
        </CTADescription>
        <HeroButton to="/register" className="primary" style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
          Create Your Account
        </HeroButton>
      </CTASection>
      
      <Footer>
        <FooterText>© 2023 Digital Wallet. All rights reserved.</FooterText>
        <FooterText>A secure and simple way to manage your money online.</FooterText>
      </Footer>
    </PageContainer>
  );
};

export default LandingPage; 