import { ArrowLeft } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MobileBackButton = () => {
  const navigate = useNavigate();

  return (
    <Stack direction={'row'} alignItems={'center'} p={0} gap={0} onClick={() => navigate(-1)}>
      <ArrowLeft />
      <Typography variant="caption" sx={{ color: '#D1D1D1' }}>
        Back
      </Typography>
    </Stack>
  );
};

export default MobileBackButton;
