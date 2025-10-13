/**
 * Authentication service
 * Works with both Mobile (AsyncStorage) and Web (localStorage)
 */

/**
 * Check if user is logged in
 * @param {object} storage - AsyncStorage (Mobile) or localStorage wrapper (Web)
 * @returns {Promise<boolean>}
 */
export const isLoggedIn = async (storage) => {
  const value = await storage.getItem('isLoggedIn');
  return value === 'true';
};

/**
 * Get current user info
 * @param {object} storage
 * @returns {Promise<object|null>}
 */
export const getCurrentUser = async (storage) => {
  const userInfoValue = await storage.getItem('userInfo');
  if (userInfoValue) {
    return JSON.parse(userInfoValue);
  }
  return null;
};

/**
 * Login user
 * @param {string} username
 * @param {string} password
 * @param {object} storage
 * @returns {Promise<object>} User data
 */
export const login = async (username, password, storage) => {
  // Demo: Check hardcoded user
  if (username === 'user' && password === '123456') {
    const userData = {
      username: 'user',
      fullName: 'Demo User',
      email: 'user@demo.com',
      phone: '0123456789',
      loginTime: new Date().toISOString(),
    };
    
    await storage.setItem('isLoggedIn', 'true');
    await storage.setItem('userInfo', JSON.stringify(userData));
    
    return userData;
  }

  // Check registered user
  const userDataStr = await storage.getItem('user');
  if (userDataStr) {
    const user = JSON.parse(userDataStr);
    if (user.username === username && user.password === password) {
      const userData = {
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        loginTime: new Date().toISOString(),
      };
      
      await storage.setItem('isLoggedIn', 'true');
      await storage.setItem('userInfo', JSON.stringify(userData));
      
      return userData;
    }
  }

  throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');
};

/**
 * Logout user
 * @param {object} storage
 * @returns {Promise<void>}
 */
export const logout = async (storage) => {
  await storage.removeItem('isLoggedIn');
  await storage.removeItem('userInfo');
};

/**
 * Update user info
 * @param {object} updates - Fields to update
 * @param {object} storage
 * @returns {Promise<object>}
 */
export const updateUserInfo = async (updates, storage) => {
  const currentUser = await getCurrentUser(storage);
  if (!currentUser) {
    throw new Error('User not logged in');
  }

  const updatedUser = {
    ...currentUser,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await storage.setItem('userInfo', JSON.stringify(updatedUser));
  
  // Also update in 'user' storage
  const userStr = await storage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    const updatedUserData = {
      ...user,
      ...updates,
    };
    await storage.setItem('user', JSON.stringify(updatedUserData));
  }

  return updatedUser;
};

/**
 * Register new user
 * @param {object} userData
 * @param {object} storage
 * @returns {Promise<object>}
 */
export const register = async (userData, storage) => {
  const { username, password, fullName, email, phone, address } = userData;

  // Check if user already exists
  const existingUser = await storage.getItem('user');
  if (existingUser) {
    const user = JSON.parse(existingUser);
    if (user.username === username) {
      throw new Error('Tên đăng nhập đã tồn tại');
    }
  }

  // Save user
  const newUser = {
    username,
    password,
    fullName,
    email,
    phone,
    address,
    createdAt: new Date().toISOString(),
  };

  await storage.setItem('user', JSON.stringify(newUser));
  
  return newUser;
};