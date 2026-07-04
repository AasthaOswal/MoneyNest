import React from 'react';
import { Link } from 'react-router-dom';
// import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';



const Navbar = () => {
  // const { theme, toggleTheme } = useTheme();

  const {user,loading} = useAuth();


  const getDashboardPath = () => {
    if (!user) return "/login";

    if (user.role === "admin") {
      return "/admin-dashboard";
    }

    if (user.role === "member") {
      return user.familyId
        ? "/dashboard/family"
        : "/family/setup";
    }

    return "/dashboard/family";
  };
  return (
    <nav className="flex justify-between items-center p-4 shadow-sm sticky top-0 z-50 bg-surface border-b border-border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
      <div className='max-w-6xl mx-auto flex justify-between w-full'>
        <div className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
          <Link to="/">WealthNest</Link>
        </div>
        <div className="flex gap-4 items-center">
          {/* <button onClick={toggleTheme} className="p-2 rounded hover:bg-black/5 dark:hover:bg-white/10" style={{ color: 'var(--color-text)' }}>
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button> */}

          <>
            <Link to="/login" className="font-medium" style={{ color: 'var(--color-text)' }}>Login</Link>

            <Link to="/signup" className="px-4 py-2 rounded font-medium text-white" style={{ backgroundColor: 'var(--color-primary)' }}>Sign Up</Link>
          </>

          


           {!loading && user &&
             (
              <>
                <Link
                  to={getDashboardPath()}
                  className="px-4 py-2 rounded font-medium text-white"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  Go to Dashboard
                </Link>

              </>
            ) 
            }
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
