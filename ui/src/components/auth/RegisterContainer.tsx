import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import axios from 'axios';
import {
  Alert,
  Box,
  Button,
  Link,
  Stack,
  TextField,
  Snackbar,
  Typography,
  useTheme,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RegisterFormFields } from '../../types/form.types';
import { formSpacing } from '../../constants';
import {
  stringValidator,
  emailValidator,
  fullNameValidator,
  passwordValidator,
} from './helpers/zod.validators';
import { useNavigate } from 'react-router-dom';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Visibility } from '@mui/icons-material';

// zod validation
const registerValidationSchema = z
  .object({
    fullName: fullNameValidator,
    email: emailValidator,
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

const RegisterContainer: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const [open, setOpen] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const { register, handleSubmit, formState } = useForm<RegisterFormFields>({
    resolver: zodResolver(registerValidationSchema),
  });

  const { errors } = formState;

  const [invalidRegistration, setInvalidRegistration] = useState<string>('');

  const handleRegister: SubmitHandler<RegisterFormFields> = async (data) => {
    try {
      const payload = await axios.post('/api/auth/signup', {
        fullName: data.fullName,
        email: data.email,
        password: data.password ?? '',
      });
      if (payload.status === 200) {
        setOpen(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err: any) {
      if (err.response && err.response.status === 409) {
        console.log('Email already exists');
        setInvalidRegistration('Email already exists, please try with another email');
      } else if (err.response && err.response.status === 422) {
        console.log('Required fields not filled');
        setInvalidRegistration('Required fields not filled');
      }
    }
  };

  return (
    <>
      <Box
        sx={{
          background: theme.palette.primary.darker,
          width: { xs: '100%', md: '50%' },
          borderRadius: '30px',
          padding: '32px 24px',
        }}
      >
        <Stack direction={'column'} margin={'auto'} spacing={formSpacing}>
          <Stack spacing={1}>
            <Typography variant="h1" color={'text'} textAlign={'center'}>
              Create Account
            </Typography>
          </Stack>
          <form onSubmit={handleSubmit(handleRegister)}>
            <Stack spacing={formSpacing}>
              <Stack spacing={1}>
                <Typography variant="subtitle1" color="secondary">
                  Full Name
                </Typography>
                <TextField
                  fullWidth
                  {...register('fullName', {
                    required: 'Required',
                  })}
                  error={!!errors?.fullName?.message}
                  helperText={errors?.fullName?.message}
                />
              </Stack>
              <Stack spacing={1}>
                <Typography variant="subtitle1" color="secondary">
                  Email
                </Typography>
                <TextField
                  fullWidth
                  autoComplete={'email'}
                  {...register('email', {
                    required: 'Required',
                  })}
                  error={!!errors?.email?.message}
                  helperText={errors?.email?.message}
                />
              </Stack>
              <Stack spacing={1}>
                <Typography variant="subtitle1" color="secondary">
                  Password
                </Typography>
                <TextField
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Required',
                  })}
                  fullWidth
                  error={!!errors?.password?.message}
                  helperText={errors?.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          color="secondary"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
              <Stack spacing={1}>
                <Typography variant="subtitle1" color="secondary">
                  Confirm Password
                </Typography>
                <TextField
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword', {
                    required: 'Required',
                  })}
                  fullWidth
                  error={!!errors?.confirmPassword?.message}
                  helperText={errors?.confirmPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          color="secondary"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
              {invalidRegistration ? (
                <Typography variant={'body2'} color={'error'}>
                  {invalidRegistration}
                </Typography>
              ) : null}
              <Button
                type={'submit'}
                style={{ borderRadius: '30px' }}
                color={'secondary'}
                variant={'contained'}
                fullWidth
              >
                <Typography variant="subtitle1">Sign Up</Typography>
              </Button>
              <Link
                href="/login"
                color="white"
                underline={'hover'}
                variant="button"
                textAlign={'center'}
              >
                <Typography variant="subtitle1">Already have an account? Login</Typography>
              </Link>
            </Stack>
          </form>
        </Stack>
      </Box>
      <Snackbar
        open={open}
        onClose={handleClose}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }} onClose={handleClose}>
          Successfully registered! Redirecting to login page...
        </Alert>
      </Snackbar>
    </>
  );
};

export default RegisterContainer;
