import { MENU_ITEMS } from '../constants/MenuItems'

/**
 * Lấy menu của nhà hàng (từ MenuItems + localStorage)
 */
export const getRestaurantMenu = (restaurantId, storage) => {
  try {
    // Món có sẵn từ MENU_ITEMS
    const staticMenu = MENU_ITEMS.filter(item => {
      if (Array.isArray(item.restaurantId)) {
        return item.restaurantId.includes(restaurantId)
      }
      return item.restaurantId === restaurantId
    })
    
    // Món tự thêm từ localStorage
    const customMenuKey = `restaurant_menu_${restaurantId}`
    const customMenu = JSON.parse(storage.getItem(customMenuKey) || '[]')
    
    return {
      staticMenu,
      customMenu,
      totalItems: staticMenu.length + customMenu.length
    }
  } catch (error) {
    console.error('Error getting restaurant menu:', error)
    return { staticMenu: [], customMenu: [], totalItems: 0 }
  }
}

/**
 * Thêm món mới
 */
export const addMenuItem = (restaurantId, menuItem, storage) => {
  try {
    const menuKey = `restaurant_menu_${restaurantId}`
    const existingMenu = JSON.parse(storage.getItem(menuKey) || '[]')
    
    const newItem = {
      id: Date.now(),
      ...menuItem,
      createdAt: new Date().toISOString(),
      restaurantId,
      isAvailable: true // ⭐ Mặc định là có bán
    }
    
    existingMenu.push(newItem)
    storage.setItem(menuKey, JSON.stringify(existingMenu))
    
    return { success: true, item: newItem }
  } catch (error) {
    console.error('Error adding menu item:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Cập nhật món
 */
export const updateMenuItem = (restaurantId, itemId, updates, storage) => {
  try {
    const menuKey = `restaurant_menu_${restaurantId}`
    const existingMenu = JSON.parse(storage.getItem(menuKey) || '[]')
    
    const updatedMenu = existingMenu.map(item => {
      if (item.id === itemId) {
        return { ...item, ...updates, updatedAt: new Date().toISOString() }
      }
      return item
    })
    
    storage.setItem(menuKey, JSON.stringify(updatedMenu))
    return { success: true }
  } catch (error) {
    console.error('Error updating menu item:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Xóa món
 */
export const deleteMenuItem = (restaurantId, itemId, storage) => {
  try {
    const menuKey = `restaurant_menu_${restaurantId}`
    const existingMenu = JSON.parse(storage.getItem(menuKey) || '[]')
    
    const updatedMenu = existingMenu.filter(item => item.id !== itemId)
    storage.setItem(menuKey, JSON.stringify(updatedMenu))
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting menu item:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Bật/tắt món (toggle availability)
 */
export const toggleMenuItemAvailability = (restaurantId, itemId, storage) => {
  try {
    const menuKey = `restaurant_menu_${restaurantId}`
    const existingMenu = JSON.parse(storage.getItem(menuKey) || '[]')
    
    const updatedMenu = existingMenu.map(item => {
      if (item.id === itemId) {
        return { ...item, isAvailable: !item.isAvailable }
      }
      return item
    })
    
    storage.setItem(menuKey, JSON.stringify(updatedMenu))
    return { success: true }
  } catch (error) {
    console.error('Error toggling menu item:', error)
    return { success: false, error: error.message }
  }
}