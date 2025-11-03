import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../../../../shared/services/adminAuthService';

export default function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState('admin@foodfast.local');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await loginAdmin({ email, password }, sessionStorage);
    if (res.success) nav('/admin', { replace: true });
    else setError(res.error || 'Đăng nhập thất bại');
  };

  return (
    <div style={{ maxWidth: 360, margin: '80px auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      <h2>Admin Login</h2>
      <form onSubmit={onSubmit}>
        <label>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} style={{ width:'100%', marginBottom:12 }} />
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width:'100%', marginBottom:12 }} />
        {error && <div style={{ color:'red', marginBottom:8 }}>{error}</div>}
        <button type="submit" style={{ width:'100%' }}>Đăng nhập</button>
      </form>
    </div>
  );
}