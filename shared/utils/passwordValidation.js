/**
 * Validate old password
 */
export const validateOldPassword = (oldPassword, currentPassword) => {
  if (oldPassword !== currentPassword) {
    return { valid: false, error: 'Mật khẩu cũ không đúng!' };
  }
  return { valid: true };
};

/**
 * Validate new password
 */
export const validateNewPassword = (newPassword) => {
  if (!newPassword || newPassword.length < 6) {
    return { valid: false, error: 'Mật khẩu mới phải từ 6 ký tự trở lên!' };
  }
  return { valid: true };
};

/**
 * Validate password match
 */
export const validatePasswordMatch = (newPassword, confirmPassword) => {
  if (newPassword !== confirmPassword) {
    return { valid: false, error: 'Mật khẩu xác nhận không khớp!' };
  }
  return { valid: true };
};

/**
 * Combined validation
 */
export const validatePasswordChange = (oldPassword, newPassword, confirmPassword, currentPassword) => {
  if (!oldPassword || !newPassword || !confirmPassword) {
    return { valid: false, error: 'Vui lòng điền đầy đủ thông tin!' };
  }
  
  const oldCheck = validateOldPassword(oldPassword, currentPassword);
  if (!oldCheck.valid) return oldCheck;
  
  const newCheck = validateNewPassword(newPassword);
  if (!newCheck.valid) return newCheck;
  
  const matchCheck = validatePasswordMatch(newPassword, confirmPassword);
  if (!matchCheck.valid) return matchCheck;
  
  return { valid: true };
};