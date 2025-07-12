import * as React from 'react';
import { Button, ButtonGroup, ButtonProps, VStack, HStack } from '@chakra-ui/react';

interface ActionButtonsProps {
  onCancel?: () => void;
  onSave?: () => void;
  cancelText?: string;
  saveText?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  spacing?: number;
  size?: ButtonProps['size'];
  orientation?: 'horizontal' | 'vertical';
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onCancel,
  onSave,
  cancelText = 'Cancel',
  saveText = 'Save',
  isLoading = false,
  isDisabled = false,
  spacing = 3,
  size = 'md',
  orientation = 'horizontal',
}) => {
  const ButtonContainer = orientation === 'horizontal' ? HStack : VStack;

  return (
    <ButtonContainer spacing={spacing}>
      {onCancel && (
        <Button
          variant="secondary"
          size={size}
          onClick={onCancel}
          isDisabled={isDisabled || isLoading}
        >
          {cancelText}
        </Button>
      )}
      {onSave && (
        <Button
          variant="primary"
          size={size}
          onClick={onSave}
          isLoading={isLoading}
          isDisabled={isDisabled}
        >
          {saveText}
        </Button>
      )}
    </ButtonContainer>
  );
};