import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export default function useLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Error de login:', err);
      let errorMessage = 'Error al iniciar sesión';
      if (err.response?.data?.error) { errorMessage = err.response.data.error; }
      else if (err.response?.data?.message) { errorMessage = err.response.data.message; }
      else if (err.response?.status === 401) { errorMessage = 'Credenciales inválidas'; }
      else if (err.message === 'Network Error') { errorMessage = 'No se pudo conectar con el servidor'; }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    error,
    loading,
    handleSubmit,
  };
}
