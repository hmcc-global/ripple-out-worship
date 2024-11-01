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
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ResetPasswordFields } from '../../types/form.types';
import { formSpacing } from '../../constants';
import { useLocation, useNavigate } from 'react-router-dom';
import { stringValidator, passwordValidator } from './helpers/zod.validators';

// zod validation
const resetPwdValidationSchema = z
  .object({
    password: passwordValidator,
    confirmPassword: stringValidator,
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: 'The passwords do not match',
      path: ['confirmPassword'],
    }
  );

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const ResetPasswordContainer: React.FC = () => {
  const query = useQuery();
  const navigate = useNavigate();
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

  const { register, handleSubmit, formState } = useForm<ResetPasswordFields>({
    resolver: zodResolver(resetPwdValidationSchema),
  });

  const { errors } = formState;

  const handleResetPassword: SubmitHandler<ResetPasswordFields> = async (data) => {
    try {
      const token = query.get('token');
      const email = query.get('email');

      const payload = await axios.post('/api/auth/reset-password', {
        email: email,
        token: token,
        password: data.password ?? '',
      });

      if (payload.status === 200) {
        setStatus('success');
        setMessage('Password successfully reset! Please login again.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setStatus('error');
        setMessage('Error resetting password, please try again.');
      }
      setOpen(true);
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        setStatus('error');
        setMessage('Invalid token, please try again.');
      } else if (err.response && err.response.status === 422) {
        setStatus('error');
        setMessage('Required fields not filled');
      } else {
        setStatus('error');
        setMessage('Error resetting password, please try again.');
      }
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
        <Stack direction={'column'} margin={'auto'} spacing={formSpacing}>
          <Stack spacing={1}>
            <Typography variant="h1" color={'text'} textAlign={'center'}>
              Reset Password
            </Typography>
            <Typography variant={'body1'} textAlign={'center'}>
              Create a new password
            </Typography>
          </Stack>
          <form onSubmit={handleSubmit(handleResetPassword)}>
            <Stack spacing={formSpacing}>
              <Stack spacing={1}>
                <Typography variant="subtitle1">Password</Typography>
                <TextField
                  type="password"
                  {...register('password', {
                    required: 'Required',
                  })}
                  fullWidth
                  error={!!errors?.password?.message}
                  helperText={errors?.password?.message}
                />
              </Stack>
              <Stack spacing={1}>
                <Typography variant="subtitle1">Confirm Password</Typography>
                <TextField
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Required',
                  })}
                  fullWidth
                  error={!!errors?.confirmPassword?.message}
                  helperText={errors?.confirmPassword?.message}
                />
              </Stack>
              <Button
                type={'submit'}
                color={'secondary'}
                style={{ borderRadius: '30px' }}
                variant={'contained'}
                fullWidth
              >
                <Typography variant="subtitle1">Reset Password</Typography>
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

export default ResetPasswordContainer;
