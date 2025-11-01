/**
 * Lấy tất cả voucher của nhà hàng
 */
export const getRestaurantVouchers = (restaurantId, storage) => {
  try {
    const voucherKey = `vouchers_${restaurantId}`
    return JSON.parse(storage.getItem(voucherKey) || '[]')
  } catch (error) {
    console.error('Error getting vouchers:', error)
    return []
  }
}

/**
 * Tạo voucher mới
 */
export const createVoucher = (restaurantId, voucherData, storage) => {
  try {
    const voucherKey = `vouchers_${restaurantId}`
    const existingVouchers = getRestaurantVouchers(restaurantId, storage)
    
    // Kiểm tra code đã tồn tại
    if (existingVouchers.some(v => v.code === voucherData.code)) {
      return { success: false, error: 'Mã voucher đã tồn tại!' }
    }
    
    const newVoucher = {
      id: Date.now(),
      ...voucherData,
      restaurantId,
      createdAt: new Date().toISOString(),
      isActive: true
    }
    
    existingVouchers.push(newVoucher)
    storage.setItem(voucherKey, JSON.stringify(existingVouchers))
    
    return { success: true, voucher: newVoucher }
  } catch (error) {
    console.error('Error creating voucher:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Cập nhật voucher
 */
export const updateVoucher = (restaurantId, voucherId, updates, storage) => {
  try {
    const voucherKey = `vouchers_${restaurantId}`
    const vouchers = getRestaurantVouchers(restaurantId, storage)
    
    const updatedVouchers = vouchers.map(v => {
      if (v.id === voucherId) {
        return { ...v, ...updates, updatedAt: new Date().toISOString() }
      }
      return v
    })
    
    storage.setItem(voucherKey, JSON.stringify(updatedVouchers))
    return { success: true }
  } catch (error) {
    console.error('Error updating voucher:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Xóa voucher
 */
export const deleteVoucher = (restaurantId, voucherId, storage) => {
  try {
    const voucherKey = `vouchers_${restaurantId}`
    const vouchers = getRestaurantVouchers(restaurantId, storage)
    
    const filteredVouchers = vouchers.filter(v => v.id !== voucherId)
    storage.setItem(voucherKey, JSON.stringify(filteredVouchers))
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting voucher:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Áp dụng voucher cho đơn hàng
 */
export const applyVoucher = (restaurantId, code, orderTotal, storage) => {
  try {
    const vouchers = getRestaurantVouchers(restaurantId, storage)
    const voucher = vouchers.find(v => 
      v.code === code && 
      v.isActive && 
      new Date(v.expiryDate) >= new Date()
    )
    
    if (!voucher) {
      return { success: false, error: 'Mã voucher không hợp lệ hoặc đã hết hạn' }
    }
    
    if (orderTotal < voucher.minOrderValue) {
      return { 
        success: false, 
        error: `Đơn hàng tối thiểu ${voucher.minOrderValue.toLocaleString()}đ` 
      }
    }
    
    let discount = 0
    if (voucher.discountType === 'percentage') {
      discount = (orderTotal * voucher.discountValue) / 100
      if (voucher.maxDiscount) {
        discount = Math.min(discount, voucher.maxDiscount)
      }
    } else {
      discount = voucher.discountValue
    }
    
    return { 
      success: true, 
      discount: Math.round(discount),
      voucher
    }
  } catch (error) {
    console.error('Error applying voucher:', error)
    return { success: false, error: error.message }
  }
}