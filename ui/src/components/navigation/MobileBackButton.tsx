import { ArrowLeft } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import { FC, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

interface MobileBackButtonProps {
  path?: string;
}

const MobileBackButton: FC<MobileBackButtonProps> = ({ path }): ReactElement => {
  const navigate = useNavigate();

  return (
    <Stack
      direction={'row'}
      alignItems={'center'}
      p={0}
      gap={0}
      onClick={() => {
        if (path && path.length > 0) navigate(path);
        else navigate(-1);
      }}
    >
      <ArrowLeft />
      <Typography variant="caption" sx={{ color: '#D1D1D1' }}>
        Back
      </Typography>
    </Stack>
  );
};

export default MobileBackButton;
