import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="flex justify-between items-center p-4 shadow-sm border-b" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
      <div className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
        <Link to="/">WealthNest</Link>
      </div>
      <div className="flex gap-4 items-center">
        <button onClick={toggleTheme} className="p-2 rounded hover:bg-black/5 dark:hover:bg-white/10" style={{ color: 'var(--color-text)' }}>
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <Link to="/login" className="font-medium" style={{ color: 'var(--color-text)' }}>Login</Link>
        <Link to="/signup" className="px-4 py-2 rounded font-medium text-white" style={{ backgroundColor: 'var(--color-primary)' }}>Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navbar;
