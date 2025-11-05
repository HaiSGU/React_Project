import { RESTAURANTS_DATA } from '../constants/RestaurantsData'

/**
 * Đăng nhập cho Restaurant Owner
 */
export const loginRestaurantOwner = (username, password, storage) => {
  const restaurant = RESTAURANTS_DATA.find(
    r => r.owner && r.owner.username === username && r.owner.password === password
  )

  if (!restaurant) {
    return {
      success: false,
      error: 'Sai tên đăng nhập hoặc mật khẩu'
    }
  }
  
  // ⚠️ KIỂM TRA TRẠNG THÁI NHÀ HÀNG
  const restaurants = JSON.parse(storage.getItem('restaurants') || '[]');
  const restaurantStatus = restaurants.find(r => r.id === restaurant.id);
  
  if (restaurantStatus) {
    if (restaurantStatus.status === 'suspended') {
      return {
        success: false,
        error: '⛔ Nhà hàng của bạn đã bị tạm ngưng hoạt động. Vui lòng liên hệ Admin!'
      }
    }
    
    if (restaurantStatus.status === 'pending') {
      return {
        success: false,
        error: '⏳ Nhà hàng của bạn đang chờ duyệt. Vui lòng chờ Admin phê duyệt!'
      }
    }
  }

  return {
    success: true,
    data: {
      id: restaurant.id,
      username: restaurant.owner.username,
      email: restaurant.owner.email,
      phone: restaurant.owner.phone,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      restaurantImage: restaurant.imageName,
      role: 'owner',
    }
  }
}

/**
 * Lưu thông tin Owner đã đăng nhập
 */
export const saveOwnerSession = (ownerData, storage) => {
  try {
    const dataToSave = {
      ...ownerData,
      role: 'owner' // ← ĐẢM BẢO CÓ ROLE
    }
    
    storage.setItem('restaurantOwner', JSON.stringify(dataToSave))
    storage.setItem('userRole', 'owner')
    
    console.log('Saved owner session:', dataToSave)
    return { success: true }
  } catch (error) {
    console.error('Save session error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Lấy thông tin Owner hiện tại
 */
export const getCurrentOwner = (storage) => {
  try {
    const ownerStr = storage.getItem('restaurantOwner')
    const userRole = storage.getItem('userRole')
    
    // ✅ KIỂM TRA NULL TRƯỚC
    if (!ownerStr) {
      console.log('getCurrentOwner: No owner data in storage')
      return null
    }
    
    if (userRole !== 'owner') {
      console.log('getCurrentOwner: User role is not owner:', userRole)
      return null
    }
    
    // ✅ PARSE SAU
    const ownerData = JSON.parse(ownerStr)
    
    // ✅ LOG SAU KHI PARSE
    console.log('getCurrentOwner check:', {
      ownerData,
      hasRole: ownerData.hasOwnProperty('role'),
      roleValue: ownerData.role
    })
    
    // ✅ KIỂM TRA ROLE
    if (!ownerData.role || ownerData.role !== 'owner') {
      console.log('getCurrentOwner: Invalid role in owner data')
      return null
    }
    
    return ownerData
    
  } catch (error) {
    console.error('Error in getCurrentOwner:', error)
    return null
  }
}

/**
 * Đăng xuất Owner
 */
export const logoutOwner = (storage) => {
  try {
    storage.removeItem('restaurantOwner')
    storage.removeItem('userRole')
    console.log('Owner logged out')
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Kiểm tra có phải Owner không
 */
export const isOwnerLoggedIn = async (storage) => {
  const owner = await getCurrentOwner(storage)
  return owner !== null
}

/**
 * Kiểm tra owner có quyền quản lý restaurant này không
 */
export const canManageRestaurant = async (restaurantId, storage) => {
  const owner = await getCurrentOwner(storage)
  if (!owner) return false
  
  return owner.restaurantId === parseInt(restaurantId)
}

/**
 * Lấy danh sách tất cả owner accounts (để hiển thị demo)
 */
export const getAllOwnerAccounts = () => {
  return RESTAURANTS_DATA
    .filter(r => r.owner)
    .map(r => ({
      restaurantName: r.name,
      username: r.owner.username,
      password: r.owner.password,
    }))
}