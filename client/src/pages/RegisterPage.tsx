import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Page } from '../components/Page';

export function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9+\-\s]{8,15}$/;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!firstName || !lastName || !email || !phone || !password) return setError('All fields are required');
    if (!emailRegex.test(email)) return setError('Enter a valid email address');
    if (!phoneRegex.test(phone.trim())) return setError('Enter a valid phone number');
    if (password.length < 6) return setError('Password must be at least 6 characters');

    try {
      setLoading(true);
      await register({ firstName, lastName, email, phone, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Create Account">
      <form onSubmit={onSubmit} className="max-w-md bg-white rounded-xl shadow p-6 space-y-3">
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <input className="w-full border rounded px-3 py-2" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" type="password" placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button disabled={loading} className="w-full bg-brand-600 text-white rounded px-3 py-2">{loading ? 'Creating...' : 'Register'}</button>
        <p className="text-sm text-slate-600">Already registered? <Link className="text-brand-600" to="/login">Login</Link></p>
      </form>
    </Page>
  );
}
