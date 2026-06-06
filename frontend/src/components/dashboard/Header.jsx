import React from 'react';
import { Menu as LucideMenu } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import NotificationButton from '../buttons/NotificationButton';
import { useNavigate } from 'react-router-dom';

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'


const Header = ({ setIsOpen }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const navigate=useNavigate();
  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-surface text-text shadow-sm">
      
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <button 
          className="md:hidden p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg"
          onClick={() => setIsOpen(true)}
        >
          <LucideMenu className="w-6 h-6" />
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
            <p className="text-sm font-semibold text-text truncate max-w-35">
              {user?.email || 'User'}
            </p>
          </div>

          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-bold uppercase">
            {user?.role}
          </span>
        </div>

        {/* <NotificationButton/> */}
        <button onClick={() => navigate("/settings/push-notifications")}>
          Manage Notifications
        </button>

        {/* THEME TOGGLE */}
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10" 
          title="Toggle Theme"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {/* ORIGINAL AVATAR */}
        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-white shadow-sm">
          {user?.email?.charAt(0).toUpperCase() || 'U'}
        </div>


{/* in dropdown we will add links to routes of - profile page, push notificaion permission and management page, logout button - and each link will have icon or atleast logout button will have icon , and the userinfo section of header also we will add here it self like atleast in smaller devices - on largger devices it can star as it is*/}
        {/* DROPDOWN */} 
        <Menu as="div" className="relative inline-block">
          <MenuButton className="flex items-center gap-1 focus:outline-none">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-white shadow-sm">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>

            <ChevronDownIcon
              aria-hidden="true"
              className="w-6 h-6 text-gray-500"
            />
          </MenuButton>

          <MenuItems
            transition
            className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-white/10 rounded-md bg-gray-800 outline-1 -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
          >
            <div className="py-1">
              <MenuItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden"
                >
                  Edit
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden"
                >
                  Duplicate
                </a>
              </MenuItem>
            </div>
            <div className="py-1">
              <MenuItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden"
                >
                  Archive
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden"
                >
                  Move
                </a>
              </MenuItem>
            </div>
            <div className="py-1">
              <MenuItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden"
                >
                  Share
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden"
                >
                  Add to favorites
                </a>
              </MenuItem>
            </div>
            <div className="py-1">
              <MenuItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden"
                >
                  Delete
                </a>
              </MenuItem>
            </div>
          </MenuItems>
        </Menu>




      </div>

      
    </header>
  );
};

export default Header;