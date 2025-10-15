export const validateFullName = (fullName) => {
  if (!fullName || !fullName.trim()) {
    return { valid: false, error: 'Vui lòng nhập họ tên' };
  }
  if (fullName.trim().length < 2) {
    return { valid: false, error: 'Họ tên phải có ít nhất 2 ký tự' };
  }
  return { valid: true };
};

export const validatePhone = (phone) => {
  if (!phone || !phone.trim()) {
    return { valid: false, error: 'Vui lòng nhập số điện thoại' };
  }
  
  // Regex cho số điện thoại VN
  const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return { valid: false, error: 'Số điện thoại không hợp lệ' };
  }
  
  return { valid: true };
};

export const validateAddress = (address) => {
  if (!address || !address.trim()) {
    return { valid: false, error: 'Vui lòng nhập địa chỉ' };
  }
  if (address.trim().length < 10) {
    return { valid: false, error: 'Địa chỉ quá ngắn' };
  }
  return { valid: true };
};

export const validateCart = (cart) => {
  if (!cart || cart.length === 0) {
    return { valid: false, error: 'Giỏ hàng trống' };
  }
  return { valid: true };
};

/**
 * Validate tất cả thông tin checkout
 */
export const validateCheckoutInfo = (fullName, phone, address, cart) => {
  const nameCheck = validateFullName(fullName);
  if (!nameCheck.valid) return nameCheck;
  
  const phoneCheck = validatePhone(phone);
  if (!phoneCheck.valid) return phoneCheck;
  
  const addressCheck = validateAddress(address);
  if (!addressCheck.valid) return addressCheck;
  
  const cartCheck = validateCart(cart);
  if (!cartCheck.valid) return cartCheck;
  
  return { valid: true };
};