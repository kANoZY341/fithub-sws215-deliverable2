import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Chatbot } from './chatbot/Chatbot';

const navBase = 'text-sm font-medium hover:text-brand-600';

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const onLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" onClick={closeMobileMenu} className="text-2xl font-bold text-brand-600">FitHub UAE</Link>
            <button
              className="md:hidden rounded border border-slate-300 px-3 py-1 text-sm"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              Menu
            </button>
          </div>
          <nav className={`${mobileOpen ? 'flex' : 'hidden'} md:flex mt-3 md:mt-0 flex-col md:flex-row md:items-center gap-3 md:gap-4`}>
            <NavLink to="/plans" onClick={closeMobileMenu} className={navBase}>Plans</NavLink>
            <NavLink to="/trainers" onClick={closeMobileMenu} className={navBase}>Trainers</NavLink>
            <NavLink to="/about" onClick={closeMobileMenu} className={navBase}>About</NavLink>
            <NavLink to="/contact" onClick={closeMobileMenu} className={navBase}>Contact</NavLink>
            {user ? (
              <>
                <NavLink to="/dashboard" onClick={closeMobileMenu} className={navBase}>Dashboard</NavLink>
                <NavLink to="/profile" onClick={closeMobileMenu} className={navBase}>Profile</NavLink>
                {user.role === 'admin' && <NavLink to="/admin" onClick={closeMobileMenu} className={navBase}>Admin</NavLink>}
                <button onClick={onLogout} className="px-3 py-1 rounded bg-slate-900 text-white text-sm">Logout</button>
              </>
            ) : (
              <>
                <NavLink to="/login" onClick={closeMobileMenu} className={navBase}>Login</NavLink>
                <NavLink to="/register" onClick={closeMobileMenu} className="px-3 py-1 rounded bg-brand-600 text-white text-sm">Register</NavLink>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-slate-900 text-slate-200 py-6 pb-24 md:pb-6 mt-8">
        <div className="max-w-6xl mx-auto px-4 text-sm flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p>FitHub UAE Gym Management System | Built with MERN</p>
          <div className="flex gap-4">
            <Link to="/about" className="hover:text-white">About</Link>
            <Link to="/contact" className="hover:text-white">Contact</Link>
            <Link to="/plans" className="hover:text-white">Plans</Link>
          </div>
        </div>
      </footer>

      <Chatbot />
    </div>
  );
}
