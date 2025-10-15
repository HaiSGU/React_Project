import { useState } from 'react';
import { validateRegisterForm } from '../utils/registerValidation';


export const useRegister = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const result = validateRegisterForm({
      username,
      password,
      confirmPassword,
      fullName,
      phone,
      address,
      gender,
    });
    
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
    setConfirmPassword('');
    setFullName('');
    setPhone('');
    setAddress('');
    setGender('');
    setError('');
    setLoading(false);
  };

  const getFormData = () => ({
    username,
    password,
    fullName,
    phone,
    address,
    gender,
  });

  return {
    username,
    setUsername,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    fullName,
    setFullName,
    phone,
    setPhone,
    address,
    setAddress,
    gender,
    setGender,
    error,
    setError,
    loading,
    setLoading,
    validate,
    reset,
    getFormData,
  };
};