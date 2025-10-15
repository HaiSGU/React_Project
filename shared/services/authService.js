/**
 * Authentication service
 * Works with both Mobile (AsyncStorage) and Web (localStorage)
 */

/**
 * Check if user is logged in
 */
export const isLoggedIn = async (storage) => {
  try {
    const value = await storage.getItem('isLoggedIn');
    return value === 'true';
  } catch (error) {
    console.error('Check login error:', error);
    return false;
  }
};

/**
 * Login user
 */
export const login = async (storage, username, password) => {
  try {
    const registeredUsersStr = await storage.getItem('user');
    
    if (!registeredUsersStr) {
      return {
        success: false,
        error: 'Không tìm thấy tài khoản nào. Vui lòng đăng ký!',
      };
    }

    let registeredUsers;
    try {
      registeredUsers = JSON.parse(registeredUsersStr);
    } catch (parseError) {
      console.error('Parse users error:', parseError);
      return {
        success: false,
        error: 'Dữ liệu tài khoản bị lỗi. Vui lòng đăng ký lại!',
      };
    }

    //  KIỂM TRA registeredUsers LÀ ARRAY
    if (!Array.isArray(registeredUsers)) {
      console.error('registeredUsers is not an array:', typeof registeredUsers);
      
      //  NẾU LÀ OBJECT → CHUYỂN THÀNH ARRAY
      if (typeof registeredUsers === 'object' && registeredUsers !== null) {
        console.log('Converting object to array...');
        registeredUsers = [registeredUsers];
        await storage.setItem('user', JSON.stringify(registeredUsers));
      } else {
        // Reset về array rỗng
        registeredUsers = [];
        await storage.setItem('user', JSON.stringify(registeredUsers));
        return {
          success: false,
          error: 'Không tìm thấy tài khoản nào. Vui lòng đăng ký!',
        };
      }
    }

    const user = registeredUsers.find(u => u.username === username);

    if (!user) {
      return {
        success: false,
        error: 'Tài khoản không tồn tại!',
      };
    }

    if (user.password !== password) {
      return {
        success: false,
        error: 'Mật khẩu không đúng!',
      };
    }

    // Save login state
    await storage.setItem('isLoggedIn', 'true');
    await storage.setItem('userInfo', JSON.stringify(user));

    return {
      success: true,
      user,
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'Đã có lỗi xảy ra!',
    };
  }
};


// Register user

export const register = async (storage, userData) => {
  try {
    const { username, password, fullName, phone, email, address, gender } = userData;

    if (!username || !password) {
      return {
        success: false,
        error: 'Vui lòng điền đầy đủ thông tin!',
      };
    }

    const registeredUsersStr = await storage.getItem('user');
    let registeredUsers = [];

    if (registeredUsersStr) {
      try {
        registeredUsers = JSON.parse(registeredUsersStr);
      } catch (parseError) {
        console.error('Parse users error:', parseError);
        registeredUsers = [];
      }
    }

    // ĐẢM BẢO registeredUsers LÀ ARRAY
    if (!Array.isArray(registeredUsers)) {
      console.warn('registeredUsers is not an array, resetting to []');
      
      // NẾU LÀ OBJECT → CHUYỂN THÀNH ARRAY
      if (typeof registeredUsers === 'object' && registeredUsers !== null) {
        console.log('Converting object to array...');
        registeredUsers = [registeredUsers];
      } else {
        registeredUsers = [];
      }
    }

    const exists = registeredUsers.some(u => u.username === username);
    if (exists) {
      return {
        success: false,
        error: 'Tài khoản đã tồn tại!',
      };
    }

    const newUser = {
      username,
      password,
      fullName: fullName || username,
      phone: phone || '',
      email: email || '',
      address: address || '',
      gender: gender || 'other',
      createdAt: new Date().toISOString(),
    };

    registeredUsers.push(newUser);
    await storage.setItem('user', JSON.stringify(registeredUsers));

    return {
      success: true,
      user: newUser,
    };
  } catch (error) {
    console.error('Register error:', error);
    return {
      success: false,
      error: 'Đã có lỗi xảy ra!',
    };
  }
};


// Get current user

export const getCurrentUser = async (storage) => {
  try {
    const userInfo = await storage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};


// Change password

export const changePassword = async (storage, oldPassword, newPassword) => {
  try {
    const userInfo = await storage.getItem('userInfo');
    
    if (!userInfo) {
      return {
        success: false,
        error: 'Vui lòng đăng nhập để đổi mật khẩu!',
      };
    }

    const user = JSON.parse(userInfo);

    if (user.password !== oldPassword) {
      return {
        success: false,
        error: 'Mật khẩu cũ không đúng!',
      };
    }

    const updatedUser = {
      ...user,
      password: newPassword,
    };

    await storage.setItem('userInfo', JSON.stringify(updatedUser));

    // Update in registered users
    const registeredUsersStr = await storage.getItem('user');
    if (registeredUsersStr) {
      let registeredUsers = JSON.parse(registeredUsersStr);
      
      // KIỂM TRA LÀ ARRAY
      if (Array.isArray(registeredUsers)) {
        const userIndex = registeredUsers.findIndex(u => u.username === user.username);
        
        if (userIndex !== -1) {
          registeredUsers[userIndex].password = newPassword;
          await storage.setItem('user', JSON.stringify(registeredUsers));
        }
      }
    }

    return {
      success: true,
      message: 'Đổi mật khẩu thành công!',
    };
  } catch (error) {
    console.error('Change password error:', error);
    return {
      success: false,
      error: 'Đã có lỗi xảy ra!',
    };
  }
};


 // Logout user

export const logout = async (storage) => {
  try {
    await storage.removeItem('isLoggedIn');
    await storage.removeItem('userInfo');
  } catch (error) {
    console.error('Logout error:', error);
  }
};


 // CLEAR ALL DATA (DEBUG/RESET)

export const clearAllData = async (storage) => {
  try {
    await storage.removeItem('user');
    await storage.removeItem('isLoggedIn');
    await storage.removeItem('userInfo');
    console.log('✅ All data cleared');
    return { success: true };
  } catch (error) {
    console.error('Clear data error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * CREATE DEMO USER (DEBUG)
 */
export const createDemoUser = async (storage) => {
  try {
    const demoUser = [{
      username: 'user',
      password: '123456',
      fullName: 'Demo User',
      phone: '0123456789',
      email: 'demo@example.com',
      address: 'Địa chỉ demo',
      gender: 'other',
      createdAt: new Date().toISOString(),
    }];
    
    await storage.setItem('user', JSON.stringify(demoUser));
    console.log('✅ Demo user created: user/123456');
    return { success: true };
  } catch (error) {
    console.error('Create demo user error:', error);
    return { success: false, error: error.message };
  }
};