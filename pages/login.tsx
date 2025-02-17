import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import GoogleIcon from '@mui/icons-material/Google';
import LilholtDinnerPlanLogo from '../assets/images/LilholtDinnerPlanLogo.png';
import { googleLogin } from '../firebase/auth';

const Login = () => {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      router.push('/dashboard');
    } catch (err: unknown) {
      console.error('Login failed:', err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          textAlign: 'center',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <Image
          src={LilholtDinnerPlanLogo}
          alt="Lilholt Dinner Plan Logo"
          width={200}
          height={200}
        />
        <Typography variant="h4" component="h1" sx={{ mt: 2, mb: 4 }}>
          Login to Lilholt Dinner Plans
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleLogin}
          size="large"
        >
          Sign in with Google
        </Button>
      </Box>
    </Container>
  );
};

export default Login;