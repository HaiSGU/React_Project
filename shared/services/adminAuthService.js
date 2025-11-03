const SESSION_KEY = 'adminSession';

const envEmail = import.meta?.env?.VITE_ADMIN_EMAIL ?? 'admin@foodfast.local';
const envHash  = import.meta?.env?.VITE_ADMIN_HASH  ?? '';

const wrap = (storage) => ({
  get: (k) => { try { return JSON.parse(storage.getItem(k)); } catch { return null; } },
  set: (k, v) => storage.setItem(k, JSON.stringify(v)),
  remove: (k) => storage.removeItem(k),
});

async function sha256Hex(str) {
  const data = new TextEncoder().encode(str);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2,'0')).join('');
}

// DEBUG: xem ENV có nạp chưa
if (import.meta?.env?.DEV) {
  console.log('[ADMIN ENV]', { email: envEmail, hash_prefix: envHash?.slice(0,8) });
}

export const loginAdmin = async ({ email, password }, storage = sessionStorage) => {
  const s = wrap(storage);

  // Nếu chưa cấu hình hash -> fallback dev để đăng nhập nhanh
  if (!envHash) {
    if (import.meta?.env?.DEV) console.warn('[ADMIN] VITE_ADMIN_HASH empty -> using DEV fallback (admin123)');
    if (email === envEmail && password === 'admin123') {
      const session = { email, devFallback: true, loggedInAt: Date.now() };
      s.set(SESSION_KEY, session);
      return { success: true, session };
    }
    return { success: false, error: 'Sai email hoặc mật khẩu' };
  }

  const inputHash = await sha256Hex(`${email}:${password}`);
  if (import.meta?.env?.DEV) console.log('[ADMIN] inputHash_prefix=', inputHash.slice(0,8));

  if (email === envEmail && inputHash === envHash) {
    const session = { email, loggedInAt: Date.now() };
    s.set(SESSION_KEY, session);
    return { success: true, session };
  }
  return { success: false, error: 'Sai email hoặc mật khẩu' };
};

export const logoutAdmin = async (storage = sessionStorage) => { wrap(storage).remove(SESSION_KEY); return { success: true }; };
export const getAdminSession = (storage = sessionStorage) => wrap(storage).get(SESSION_KEY);
export const isAdminAuthenticated = (storage = sessionStorage) => !!getAdminSession(storage);