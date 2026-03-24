import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
              F
            </div>
            <span className="text-xl font-bold text-text tracking-tight">FamFinance</span>
          </Link>

          <div className="flex items-center gap-6">
            {/* Theme Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg bg-bg border border-border text-text hover:border-primary transition-all"
              aria-label="Toggle Theme"
            >
              {isDark ? '🌙' : '☀️'}
            </button>

            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-muted hover:text-text transition-colors">
                Log in
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-hover shadow-md transition-all"
              >
                Start for Free
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;