import React, { useState } from 'react';
import { Dialog, Button, TextField, Alert, CircularProgress, Typography, Box, Paper, Divider } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

interface Props { open: boolean; onClose: () => void; onSuccess?: () => void; onOpenRegister?: () => void }

const LoginModal: React.FC<Props> = ({ open, onClose, onSuccess, onOpenRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!email || !password) { setError('Email and password are required'); return; }
    setLoading(true);
    try {
      await login(email, password);
      onSuccess?.();
      onClose();
    } catch (e: any) {
      setError(e.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: 500
        }
      }}
    >
      <Paper elevation={0} sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: '#1976d2',
              mb: 1,
              fontSize: '2rem'
            }}
          >
            My Group
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: '#666',
              fontSize: '1rem'
            }}
          >
            Welcome back! Please sign in to your account
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Login Form */}
        <Box component="form" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            sx={{ mb: 2 }}
            variant="outlined"
            required
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            sx={{ mb: 3 }}
            variant="outlined"
            required
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              py: 1.5,
              mb: 2,
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </Button>

          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          <Button
            fullWidth
            variant="outlined"
            size="large"
            onClick={onOpenRegister}
            sx={{
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            Create New Account
          </Button>
        </Box>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Button
              variant="text"
              onClick={onOpenRegister}
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                p: 0,
                minWidth: 'auto'
              }}
            >
              Register here
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Dialog>
  );
};

export default LoginModal;

