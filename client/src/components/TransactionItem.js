import React from 'react';
import styled from 'styled-components';
import { 
  FaArrowUp, 
  FaArrowDown, 
  FaQuestionCircle, 
  FaCheckCircle, 
  FaTimesCircle,
  FaHourglassHalf,
  FaUser,
  FaHandHoldingUsd,
  FaHandHoldingMedical
} from 'react-icons/fa';
import Button from './Button';
import { useAuth } from '../context/AuthContext';

const TransactionCard = styled.div`
  border-bottom: 1px solid var(--border-color);
  padding: 1.2rem 0.7rem;
  display: flex;
  flex-direction: column;
  
  &:last-child {
    border-bottom: none;
  }
`;

const TransactionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.9rem;
`;

const TransactionType = styled.div`
  display: flex;
  align-items: center;
  color: ${({ type }) => 
    type === 'SENT' ? 'var(--danger-color)' : 
    type === 'RECEIVED' ? 'var(--secondary-color)' : 
    type === 'REQUEST_SENT' ? 'var(--warning-color)' :
    type === 'REQUEST_RECEIVED' ? 'var(--primary-color)' :
    'var(--primary-color)'
  };
  font-weight: 500;
  font-family: 'Google Sans', sans-serif;
  font-size: 1.05rem;
  
  svg {
    margin-right: 0.5rem;
    font-size: 1.1rem;
  }
`;

const TransactionAmount = styled.div`
  font-size: 1.3rem;
  font-weight: 500;
  font-family: 'Google Sans', sans-serif;
  color: ${({ type, amount }) => {
    if (amount.startsWith('+')) return 'var(--secondary-color)';
    if (amount.startsWith('-')) return 'var(--danger-color)';
    
    return type === 'SENT' ? 'var(--danger-color)' : 
      type === 'RECEIVED' ? 'var(--secondary-color)' : 
      type === 'REQUEST_SENT' ? 'var(--warning-color)' :
      type === 'REQUEST_RECEIVED' ? 'var(--primary-color)' :
      'var(--text-dark)';
  }};
`;

const TransactionDetails = styled.div`
  margin-top: 0.7rem;
`;

const TransactionUser = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.7rem;
  color: var(--text-dark);
  font-size: 1.05rem;
  
  svg {
    color: var(--text-secondary);
    margin-right: 0.5rem;
    font-size: 1.1rem;
  }
  
  span {
    font-weight: 400;
    margin-left: 0.25rem;
  }
`;

const TransactionDescription = styled.div`
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 0.7rem;
`;

const TransactionDate = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-left: 0.6rem;
  background-color: ${({ status }) => 
    status === 'COMPLETED' ? 'rgba(52, 168, 83, 0.1)' : 
    status === 'PENDING' ? 'rgba(251, 188, 4, 0.1)' : 
    status === 'REJECTED' ? 'rgba(234, 67, 53, 0.1)' : 
    'rgba(95, 99, 104, 0.1)'
  };
  color: ${({ status }) => 
    status === 'COMPLETED' ? 'var(--secondary-color)' : 
    status === 'PENDING' ? 'var(--warning-color)' : 
    status === 'REJECTED' ? 'var(--danger-color)' : 
    'var(--text-secondary)'
  };
  
  svg {
    margin-right: 0.3rem;
    font-size: 0.9rem;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const TransactionItem = ({ transaction, onAccept, onReject }) => {
  const { user } = useAuth(); // Get current user from context

  const {
    _id,
    type,
    status,
    amount,
    description,
    createdAt,
    sender,
    receiver
  } = transaction;

  // Fix the user ID comparison to handle various ID formats
  // MongoDB objects sometimes come as strings or objects with _id property
  const getCurrentUserId = () => {
    return user?._id || localStorage.getItem('userId');
  };

  const getSenderId = () => {
    if (typeof sender === 'object' && sender !== null) {
      return sender._id;
    }
    return sender;
  };

  const getReceiverId = () => {
    if (typeof receiver === 'object' && receiver !== null) {
      return receiver._id;
    }
    return receiver;
  };

  // Determine if current user is the sender or receiver
  const isCurrentUserSender = getSenderId() === getCurrentUserId();
  const isCurrentUserReceiver = getReceiverId() === getCurrentUserId();

  // Check which user data is available
  const getSenderInfo = () => {
    if (typeof sender === 'object' && sender !== null) {
      return { firstName: sender.firstName, lastName: sender.lastName };
    }
    return { firstName: "Unknown", lastName: "User" };
  };

  const getReceiverInfo = () => {
    if (typeof receiver === 'object' && receiver !== null) {
      return { firstName: receiver.firstName, lastName: receiver.lastName };
    }
    return { firstName: "Unknown", lastName: "User" };
  };

  console.log('Transaction:', { 
    type, 
    status,
    userId: getCurrentUserId(), 
    senderId: getSenderId(), 
    receiverId: getReceiverId(),
    isCurrentUserSender,
    isCurrentUserReceiver
  });

  // Determine the display type based on transaction type, status, and user role
  let displayType;
  let otherUser;
  let showAmountSign = '';

  if (type === 'SEND') {
    // For regular money transfers
    if (isCurrentUserSender) {
      displayType = 'SENT';
      otherUser = getReceiverInfo();
      showAmountSign = '-'; // Show negative amount for sender
    } else {
      displayType = 'RECEIVED';
      otherUser = getSenderInfo();
      showAmountSign = '+'; // Show positive amount for receiver
    }
  } else if (type === 'REQUEST') {
    if (status === 'PENDING') {
      // Pending requests - no money has moved yet
      if (isCurrentUserReceiver) {
        displayType = 'REQUEST_SENT';
        otherUser = getSenderInfo();
        // No sign for pending requests
      } else {
        displayType = 'REQUEST_RECEIVED';
        otherUser = getReceiverInfo();
        // No sign for pending requests
      }
    } else if (status === 'COMPLETED') {
      // Completed requests - money has been transferred
      // Similar to a regular SEND transaction, but initiated by the receiver
      if (isCurrentUserSender) {
        displayType = 'REQUEST_COMPLETED';
        otherUser = getReceiverInfo();
        showAmountSign = '-'; // Sender paid, so negative amount
      } else {
        displayType = 'REQUEST_FULFILLED';
        otherUser = getSenderInfo();
        showAmountSign = '+'; // Receiver got paid, so positive amount
      }
    } else if (status === 'REJECTED') {
      // Rejected requests - no money transferred
      if (isCurrentUserReceiver) {
        displayType = 'REQUEST_REJECTED';
        otherUser = getSenderInfo();
      } else {
        displayType = 'REQUEST_DECLINED';
        otherUser = getReceiverInfo();
      }
    }
  }

  const formattedDate = new Date(createdAt).toLocaleString();

  const getTypeIcon = () => {
    switch (displayType) {
      case 'SENT':
      case 'REQUEST_COMPLETED':
        return <FaArrowUp />;
      case 'RECEIVED':
      case 'REQUEST_FULFILLED':
        return <FaArrowDown />;
      case 'REQUEST_SENT':
      case 'REQUEST_REJECTED':
        return <FaHandHoldingUsd />;
      case 'REQUEST_RECEIVED':
      case 'REQUEST_DECLINED':
        return <FaHandHoldingMedical />;
      default:
        return <FaQuestionCircle />;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'COMPLETED':
        return <FaCheckCircle />;
      case 'PENDING':
        return <FaHourglassHalf />;
      case 'REJECTED':
        return <FaTimesCircle />;
      default:
        return null;
    }
  };

  // Show actions only if this is a request received by the current user (they are the sender/payer)
  // and if the request is still pending
  const showActions = type === 'REQUEST' && status === 'PENDING' && isCurrentUserSender;

  // Format the display text based on the transaction type
  const getDisplayText = () => {
    switch (displayType) {
      case 'SENT':
        return 'SENT';
      case 'RECEIVED':
        return 'RECEIVED';
      case 'REQUEST_SENT':
        return 'REQUESTED';
      case 'REQUEST_RECEIVED':
        return 'REQUEST';
      case 'REQUEST_COMPLETED':
        return 'PAID REQUEST';
      case 'REQUEST_FULFILLED':
        return 'REQUEST RECEIVED';
      case 'REQUEST_REJECTED':
        return 'REQUEST REJECTED';
      case 'REQUEST_DECLINED':
        return 'DECLINED';
      default:
        return displayType;
    }
  };

  // Get appropriate prefix/label for the user display
  const getUserLabel = () => {
    switch (displayType) {
      case 'SENT':
      case 'REQUEST_COMPLETED':
        return 'To:';
      case 'RECEIVED':
      case 'REQUEST_FULFILLED':
        return 'From:';
      case 'REQUEST_SENT':
      case 'REQUEST_REJECTED':
        return 'From:';
      case 'REQUEST_RECEIVED':
      case 'REQUEST_DECLINED':
        return 'To:';
      default:
        return '';
    }
  };

  return (
    <TransactionCard>
      <TransactionHeader>
        <TransactionType type={displayType}>
          {getTypeIcon()} {getDisplayText()}
          <StatusBadge status={status}>
            {getStatusIcon()} {status}
          </StatusBadge>
        </TransactionType>
        <TransactionAmount type={displayType} amount={`${showAmountSign}${amount.toFixed(2)}`}>
          {showAmountSign}${amount.toFixed(2)}
        </TransactionAmount>
      </TransactionHeader>

      <TransactionDetails>
        <TransactionUser>
          <FaUser />
          {getUserLabel()}
          <span>{otherUser.firstName} {otherUser.lastName}</span>
        </TransactionUser>

        {description && (
          <TransactionDescription>
            {description}
          </TransactionDescription>
        )}

        <TransactionDate>{formattedDate}</TransactionDate>

        {showActions && (
          <ActionsContainer>
            <Button 
              variant="success" 
              onClick={() => onAccept(_id)}
              size="small"
            >
              Accept
            </Button>
            <Button 
              variant="danger" 
              onClick={() => onReject(_id)}
              size="small"
            >
              Reject
            </Button>
          </ActionsContainer>
        )}
      </TransactionDetails>
    </TransactionCard>
  );
};

export default TransactionItem;
