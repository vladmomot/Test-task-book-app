import React from 'react';
import { ButtonContainer, ButtonText } from './styles';

interface Props {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  style?: any;
  textStyle?: any;
}

export const StyledPrimaryButton = ({
  title,
  onPress,
  variant = 'primary',
  style,
  textStyle,
}: Props) => {
  return (
    <ButtonContainer variant={variant} onPress={onPress} style={style}>
      <ButtonText variant={variant} style={textStyle}>
        {title}
      </ButtonText>
    </ButtonContainer>
  );
};

export default StyledPrimaryButton;
