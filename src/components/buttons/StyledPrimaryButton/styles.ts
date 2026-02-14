import styled from 'styled-components/native';

export const ButtonContainer = styled.TouchableOpacity<{
  variant?: 'primary' | 'secondary' | 'outline';
}>`
  margin: 8px;
  height: 40px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;

  background-color: ${({ variant }) => {
    switch (variant) {
      case 'secondary':
        return '#a6a6a6';
      case 'outline':
        return 'transparent';
      default:
        return '#BF4F74';
    }
  }};

  border-width: ${({ variant }) => (variant === 'outline' ? '1px' : '0px')};
  border-color: #bf4f74;
`;

export const ButtonText = styled.Text<{
  variant?: 'primary' | 'secondary' | 'outline';
}>`
  font-size: 16px;
  font-weight: 600;

  color: ${({ variant }) => {
    if (variant === 'outline') return '#BF4F74';
    return 'white';
  }};
`;
