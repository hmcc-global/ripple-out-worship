import React from 'react';
import { Button, Stack, StackProps } from '@mui/material';

interface ActionButtonsProps extends Omit<StackProps, 'children'> {
  onSave?: () => void;
  onCancel?: () => void;
  saveText?: string;
  cancelText?: string;
  saveDisabled?: boolean;
  cancelDisabled?: boolean;
  isLoading?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onSave,
  onCancel,
  saveText = 'Save',
  cancelText = 'Cancel',
  saveDisabled = false,
  cancelDisabled = false,
  isLoading = false,
  ...stackProps
}) => {
  return (
    <Stack direction="row" spacing={2} {...stackProps}>
      {onCancel && (
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={cancelDisabled || isLoading}
        >
          {cancelText}
        </Button>
      )}
      {onSave && (
        <Button
          variant="contained"
          onClick={onSave}
          disabled={saveDisabled || isLoading}
        >
          {isLoading ? 'Saving...' : saveText}
        </Button>
      )}
    </Stack>
  );
};

export default ActionButtons;