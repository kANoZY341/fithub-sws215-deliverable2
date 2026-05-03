import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Page } from '../components/Page';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const loginMessage = (location.state as { message?: string } | undefined)?.message;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) return setError('Email and password are required');
    if (!emailRegex.test(email)) return setError('Enter a valid email address');

    try {
      setLoading(true);
      await login(email, password);
      const target = (location.state as { from?: string } | undefined)?.from || '/dashboard';
      navigate(target);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Login">
      <form onSubmit={onSubmit} className="max-w-md bg-white rounded-xl shadow p-6 space-y-3">
        {loginMessage && <p className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">{loginMessage}</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <input className="w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button disabled={loading} className="w-full bg-brand-600 text-white rounded px-3 py-2">{loading ? 'Signing in...' : 'Login'}</button>
        <p className="text-sm text-slate-600">No account? <Link className="text-brand-600" to="/register">Register</Link></p>
      </form>
    </Page>
  );
}
