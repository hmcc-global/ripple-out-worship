import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import axios from 'axios';
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Snackbar,
  Alert,
  AlertColor,
  useTheme,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RecoverPasswordFields } from '../../types/form.types';
import { formSpacing } from '../../constants';
import { ArrowBackRounded } from '@mui/icons-material';
import { emailValidator } from './helpers/zod.validators';

// zod validation
const recoverPwdValidationSchema = z.object({
  email: emailValidator,
});

const RecoverPasswordContainer: React.FC = () => {
  const theme = useTheme();
  const [open, setOpen] = useState<boolean>(false);
  const [status, setStatus] = useState<AlertColor | undefined>();
  const [message, setMessage] = useState<string>('');

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const { register, handleSubmit, formState } = useForm<RecoverPasswordFields>({
    resolver: zodResolver(recoverPwdValidationSchema),
  });

  const { errors } = formState;

  const handleRecoverPassword: SubmitHandler<RecoverPasswordFields> = async (data) => {
    try {
      const payload = await axios.post('/api/auth/forgot-password', {
        email: data.email,
      });

      if (payload.status === 200) {
        setStatus('success');
        setMessage('Password recovery email successfully sent! Please check your email.');
      } else {
        setStatus('error');
        setMessage('An error occurred. Please try again.');
      }
      setOpen(true);
    } catch (err: any) {
      setStatus('error');
      setMessage('An error occurred. Please try again.');
      setOpen(true);
    }
  };

  return (
    <>
      <Box
        sx={{
          background: theme.palette.primary.darker,
          borderRadius: ['15px', '30px'],
          padding: '32px 24px',
          width: { xs: '100%', md: '50%' },
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          component={RouterLink}
          to="/"
          color="primary"
          sx={{ textDecoration: 'none' }}
          marginBottom={['0.75rem', '1.5rem']}
        >
          <ArrowBackRounded style={{ color: theme.palette.text.primary }} />
          <Typography variant="body1" color={'text'} marginLeft={1}>
            Return to Login
          </Typography>
        </Box>
        <Stack direction={'column'} margin={'auto'} spacing={formSpacing}>
          <Stack spacing={1}>
            <Typography variant="h1" color={'text'} textAlign={'center'}>
              Recover Password
            </Typography>
          </Stack>
          <form onSubmit={handleSubmit(handleRecoverPassword)}>
            <Stack spacing={formSpacing}>
              <Stack spacing={1}>
                <Typography variant="subtitle1">Email</Typography>
                <TextField
                  {...register('email', {
                    required: 'Required',
                  })}
                  fullWidth
                  error={!!errors?.email?.message}
                  helperText={errors?.email?.message}
                />
              </Stack>
              <Typography variant={'body1'} textAlign={'left'}>
                Please input the email you used to create your HMCC account. (This will only be
                applicable if you signed up using your personal email)
              </Typography>
              <Button
                type={'submit'}
                color={'secondary'}
                style={{ borderRadius: '30px' }}
                variant={'contained'}
                fullWidth
              >
                <Typography variant="subtitle1">Send Recovery Link</Typography>
              </Button>
            </Stack>
          </form>
        </Stack>
      </Box>
      <Snackbar
        open={open}
        onClose={handleClose}
        autoHideDuration={9000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={status} sx={{ width: '100%' }} onClose={handleClose}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default RecoverPasswordContainer;
