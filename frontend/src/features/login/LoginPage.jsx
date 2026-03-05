import { Box, Card, CardContent, Alert } from '@mui/material';
import useLogin from './hooks/useLogin';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import {
  loginContainerSx,
  loginCardSx,
  loginCardContentSx,
  loginErrorAlertSx,
} from './styles/loginStyles';

export default function LoginPage() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    error,
    loading,
    handleSubmit,
  } = useLogin();

  return (
    <Box sx={loginContainerSx}>
      <Card sx={loginCardSx}>
        <CardContent sx={loginCardContentSx}>
          <LoginHeader />
          {error && (
            <Alert severity="error" sx={loginErrorAlertSx}>
              {error}
            </Alert>
          )}
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            loading={loading}
            handleSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
