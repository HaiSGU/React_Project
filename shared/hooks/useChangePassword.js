import { useState } from 'react';
import { validatePasswordChange } from '../utils/passwordValidation';

export const useChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = (currentPassword) => {
    const result = validatePasswordChange(
      oldPassword,
      newPassword,
      confirmPassword,
      currentPassword
    );
    
    if (!result.valid) {
      setError(result.error);
      return false;
    }
    
    setError('');
    return true;
  };

  const reset = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setLoading(false);
  };

  return {
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    setError,
    loading,
    setLoading,
    validate,
    reset,
  };
};