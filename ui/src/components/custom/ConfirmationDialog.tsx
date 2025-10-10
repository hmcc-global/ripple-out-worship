import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from '@mui/material';

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: React.ReactNode;
  message?: string;
  children?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  cancelColor?: 'primary' | 'error' | 'warning' | 'success';
  confirmColor?: 'primary' | 'error' | 'warning' | 'success';
  showCloseIcon?: boolean;
}

const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  cancelColor = 'primary',
  confirmColor = 'primary',
  showCloseIcon = false,
}: ConfirmationDialogProps) => (
  <Dialog
    open={open}
    onClose={onClose}
    aria-labelledby="confirmation-dialog-title"
    aria-describedby="confirmation-dialog-description"
  >
    <DialogTitle
      id="confirmation-dialog-title"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      {title}
      {showCloseIcon ? (
        <IconButton onClick={onClose}>
          <CloseIcon color="secondary" />
        </IconButton>
      ) : null}
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="confirmation-dialog-description">{message}</DialogContentText>
      {children}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} variant="outlined" color={cancelColor}>
        {cancelText}
      </Button>
      <Button onClick={onConfirm} variant="contained" color={confirmColor} autoFocus>
        {confirmText}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmationDialog;
