import { useState } from 'react';
import { validateLoginForm } from '../utils/loginValidation';

export const useLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const result = validateLoginForm(username, password);
    if (!result.valid) {
      setError(result.error);
      return false;
    }
    setError('');
    return true;
  };

  const reset = () => {
    setUsername('');
    setPassword('');
    setError('');
    setLoading(false);
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    error,
    setError,
    loading,
    setLoading,
    validate,
    reset,
  };
};