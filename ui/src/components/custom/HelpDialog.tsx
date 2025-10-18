import { FC, ReactNode, useState } from 'react';
import { IconButton, Dialog, DialogTitle, DialogContent, DialogContentText } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface HelpDialogProps {
  icon: ReactNode;
  title: string;
  content: ReactNode;
}

const HelpDialog: FC<HelpDialogProps> = ({ icon, title, content }) => {
  const [open, setOpen] = useState(false);

  const handleOpenHelpDialog = () => {
    setOpen(!open);
  };

  return (
    <>
      <IconButton color="secondary" onClick={handleOpenHelpDialog}>
        {icon}
      </IconButton>
      <Dialog open={open} onClose={handleOpenHelpDialog}>
        <DialogTitle variant="h2" color="primary">
          {title}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleOpenHelpDialog}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HelpDialog;
