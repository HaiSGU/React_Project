// src/api/api.js
const BASE_URL = "http://localhost:3000";

/**
 * LOGIN - giả lập bằng json-server: query users theo username + password
 */
export async function login(username, password) {
  const res = await fetch(`${BASE_URL}/users?username=${username}&password=${password}`);
  const users = await res.json();
  if (users.length > 0) {
    return { user: users[0] }; // thành công
  } else {
    throw new Error("Sai username hoặc mật khẩu!");
  }
}

/**
 * REGISTER - giả lập tạo user
 */
export async function register(userData) {
  const res = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return res.json();
}

/**
 * CATEGORIES
 */
export async function getCategories() {
  const res = await fetch(`${BASE_URL}/categories`);
  return res.json();
}

/**
 * RESTAURANTS theo Category
 */
export async function getRestaurantsByCategory(categoryId) {
  const res = await fetch(`${BASE_URL}/restaurants?categoryId=${categoryId}`);
  return res.json();
}

/**
 * MENU theo Restaurant
 */
export async function getMenuByRestaurant(restaurantId) {
  const res = await fetch(`${BASE_URL}/menus?restaurantId=${restaurantId}`);
  return res.json();
}

/**
 * ORDERS
 */
export async function createOrder(order) {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });
  return res.json();
}

export async function getOrders(status) {
  const res = await fetch(`${BASE_URL}/orders`);
  return res.json();
}

/**
 * PROFILE (giả lập lấy user info từ db.json)
 */
export async function getProfile(userId) {
  const res = await fetch(`${BASE_URL}/users/${userId}`);
  return res.json();
}

export async function updateProfile(userId, newData) {
  const res = await fetch(`${BASE_URL}/users/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newData),
  });
  return res.json();
}