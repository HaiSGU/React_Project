export const validateOldPassword = (oldPassword, currentPassword) => {
  if (oldPassword !== currentPassword) {
    return { valid: false, error: 'Mật khẩu cũ không đúng!' };
  }
  return { valid: true };
};

export const validateNewPassword = (newPassword) => {
  if (!newPassword || newPassword.length < 6) {
    return { valid: false, error: 'Mật khẩu mới phải từ 6 ký tự trở lên!' };
  }
  
  // Có thể thêm rules phức tạp hơn
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  
  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    return { 
      valid: false, 
      error: 'Mật khẩu phải có chữ hoa, chữ thường và số!' 
    };
  }
  
  return { valid: true };
};

export const validatePasswordMatch = (newPassword, confirmPassword) => {
  if (newPassword !== confirmPassword) {
    return { valid: false, error: 'Mật khẩu xác nhận không khớp!' };
  }
  return { valid: true };
};

//Combined validation
export const validatePasswordChange = (oldPassword, newPassword, confirmPassword, currentPassword) => {
  const oldCheck = validateOldPassword(oldPassword, currentPassword);
  if (!oldCheck.valid) return oldCheck;
  
  const newCheck = validateNewPassword(newPassword);
  if (!newCheck.valid) return newCheck;
  
  const matchCheck = validatePasswordMatch(newPassword, confirmPassword);
  if (!matchCheck.valid) return matchCheck;
  
  return { valid: true };
};