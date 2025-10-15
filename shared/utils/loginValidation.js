

export const validateLoginUsername = (username) => {
  if (!username || !username.trim()) {
    return { valid: false, error: 'Vui lòng nhập tên đăng nhập!' };
  }
  return { valid: true };
};

export const validateLoginPassword = (password) => {
  if (!password || !password.trim()) {
    return { valid: false, error: 'Vui lòng nhập mật khẩu!' };
  }
  return { valid: true };
};

export const validateLoginForm = (username, password) => {
  const usernameCheck = validateLoginUsername(username);
  if (!usernameCheck.valid) return usernameCheck;
  
  const passwordCheck = validateLoginPassword(password);
  if (!passwordCheck.valid) return passwordCheck;
  
  return { valid: true };
};