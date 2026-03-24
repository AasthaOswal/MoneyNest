// import React from 'react';
// import { Menu, Bell, Search } from 'lucide-react';
// import { useTheme } from '../../context/ThemeContext';

// const Header = ({ setIsOpen }) => {
//   const { theme, toggleTheme } = useTheme();

//   return (
//     <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-surface text-text shadow-sm">
//       <div className="flex items-center gap-4">
//         <button 
//           className="md:hidden p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg"
//           onClick={() => setIsOpen(true)}
//         >
//           <Menu className="w-6 h-6" />
//         </button>
//         <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg border border-border text-muted">
//           <Search className="w-4 h-4" />
//           <span className="text-sm">Search...</span>
//         </div>
//       </div>

//       <div className="flex items-center gap-4">
//         <button className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-muted">
//           <Bell className="w-5 h-5" />
//         </button>
//         <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10" title="Toggle Theme">
//           {theme === 'light' ? '🌙' : '☀️'}
//         </button>
//         <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-white shadow-sm">
//           U
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;


import React from 'react';
import { Menu } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const Header = ({ setIsOpen }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-surface text-text shadow-sm">
      
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <button 
          className="md:hidden p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* USER INFO (moved from sidebar) */}
        <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-lg bg-black/5 dark:bg-white/5">
          <div className="flex flex-col leading-tight">
            <p className="text-[10px] text-muted uppercase tracking-wider">
              Signed in as
            </p>
            <p className="text-sm font-semibold text-text truncate max-w-[140px]">
              {user?.email || 'User'}
            </p>
          </div>

          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-bold uppercase">
            {user?.role}
          </span>
        </div>

        {/* THEME TOGGLE */}
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10" 
          title="Toggle Theme"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {/* AVATAR */}
        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-white shadow-sm">
          {user?.email?.charAt(0).toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  );
};

export default Header;