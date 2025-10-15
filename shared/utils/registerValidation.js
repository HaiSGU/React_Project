

export const validateUsername = (username) => {
  if (!username || !username.trim()) {
    return { valid: false, error: 'Vui lòng nhập tên đăng nhập!' };
  }
  if (username.trim().length < 3) {
    return { valid: false, error: 'Tên đăng nhập phải có ít nhất 3 ký tự!' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { valid: false, error: 'Tên đăng nhập chỉ được chứa chữ, số và dấu gạch dưới!' };
  }
  return { valid: true };
};

export const validatePassword = (password) => {
  if (!password || !password.trim()) {
    return { valid: false, error: 'Vui lòng nhập mật khẩu!' };
  }
  if (password.length < 6) {
    return { valid: false, error: 'Mật khẩu phải có ít nhất 6 ký tự!' };
  }
  return { valid: true };
};

export const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return { valid: false, error: 'Mật khẩu xác nhận không khớp!' };
  }
  return { valid: true };
};

export const validateFullName = (fullName) => {
  if (!fullName || !fullName.trim()) {
    return { valid: false, error: 'Vui lòng nhập họ tên!' };
  }
  if (fullName.trim().length < 2) {
    return { valid: false, error: 'Họ tên quá ngắn!' };
  }
  return { valid: true };
};

export const validatePhone = (phone) => {
  if (!phone || !phone.trim()) {
    return { valid: false, error: 'Vui lòng nhập số điện thoại!' };
  }
  const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return { valid: false, error: 'Số điện thoại không hợp lệ!' };
  }
  return { valid: true };
};

export const validateAddress = (address) => {
  if (!address || !address.trim()) {
    return { valid: false, error: 'Vui lòng nhập địa chỉ!' };
  }
  if (address.trim().length < 10) {
    return { valid: false, error: 'Địa chỉ quá ngắn!' };
  }
  return { valid: true };
};

export const validateGender = (gender) => {
  if (!gender) {
    return { valid: false, error: 'Vui lòng chọn giới tính!' };
  }
  return { valid: true };
};

/**
 * Validate tất cả thông tin đăng ký
 */
export const validateRegisterForm = (formData) => {
  const { username, password, confirmPassword, fullName, phone, address, gender } = formData;
  
  const usernameCheck = validateUsername(username);
  if (!usernameCheck.valid) return usernameCheck;
  
  const passwordCheck = validatePassword(password);
  if (!passwordCheck.valid) return passwordCheck;
  
  const passwordMatchCheck = validatePasswordMatch(password, confirmPassword);
  if (!passwordMatchCheck.valid) return passwordMatchCheck;
  
  const fullNameCheck = validateFullName(fullName);
  if (!fullNameCheck.valid) return fullNameCheck;
  
  const phoneCheck = validatePhone(phone);
  if (!phoneCheck.valid) return phoneCheck;
  
  const addressCheck = validateAddress(address);
  if (!addressCheck.valid) return addressCheck;
  
  const genderCheck = validateGender(gender);
  if (!genderCheck.valid) return genderCheck;
  
  return { valid: true };
};