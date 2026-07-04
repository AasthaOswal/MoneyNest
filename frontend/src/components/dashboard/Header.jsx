import React from 'react';
import { Menu as LucideMenu } from 'lucide-react';
// import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
// import NotificationButton from '../buttons/NotificationButton';
import { useNavigate } from 'react-router-dom';

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import {
  User,
  Bell,
  LogOut
} from "lucide-react";

const Header = ({ setIsOpen }) => {
  // const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-border bg-surface text-text shadow-card">

      {/* LEFT */}
      <div className="flex items-center gap-3">
        <button
          className="md:hidden p-2 rounded-lg hover:bg-surface-2 transition-colors"
          onClick={() => setIsOpen(true)}
        >
          <LucideMenu className="w-5 h-5" />
        </button>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">

        {/* Desktop User Info */}
        {/* <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-xl bg-surface-2 border border-border">
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] uppercase tracking-wider text-muted">
              Signed in as
            </span>

            <span className="text-sm font-medium text-text max-w-48 truncate">
              {user?.email || "User"}
            </span>
          </div>

          <span className="px-2 py-1 text-[10px] rounded-full font-semibold uppercase bg-primary-subtle text-primary">
            {user?.role}
          </span>
        </div> */}


        {/* Theme Toggle
        <button
          onClick={toggleTheme}
          title="Toggle Theme"
          className="
            p-2.5
            rounded-xl
            border border-border
            bg-surface-2
            hover:bg-card-hover
            transition-colors
          "
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button> */}

        {/* User Dropdown */}
        <Menu as="div" className="relative ">
          <MenuButton className="flex items-center gap-2 focus:outline-none rounded-xl
            border border-border
            bg-surface-2
            hover:bg-card-hover
            transition-colors p-2 hover:cursor-pointer">

            <div className="w-8 h-8 rounded-full bg-primary text-text-on-primary flex items-center justify-center font-bold shadow-card">
              {user?.name?.charAt(0).toUpperCase() ||
                user?.email?.charAt(0).toUpperCase() ||
                "U"}
            </div>

            <ChevronDownIcon className="w-5 h-5 text-muted" />
          </MenuButton>

          <MenuItems
            transition
            className="
              absolute right-0 mt-3 w-50 origin-top-right
              rounded-2xl
              border border-border
              bg-surface
              shadow-card
              overflow-hidden
              z-50
              data-closed:scale-95
              data-closed:opacity-0
              transition
            "
          >

            {/* Mobile User Info */}
            <div className="lg:hidden px-4 py-4 border-b border-border">
              <p className="text-[10px] uppercase tracking-wider text-muted">
                Signed in as
              </p>

              <p className="mt-1 text-sm font-medium text-text break-all">
                {user?.email}
              </p>

              <span className="inline-block mt-3 px-2 py-1 rounded-full text-[10px] font-semibold uppercase bg-primary-subtle text-primary">
                {user?.role}
              </span>
            </div>

            {/* Profile */}
            <MenuItem>
              <button
                onClick={() => navigate("/profile")}
                className="
                  flex items-center gap-3
                  w-full px-4 py-3
                  text-sm text-text
                  hover:bg-surface-2
                  transition-colors
                  hover:cursor-pointer
                "
              >
                <User className="w-4 h-4" />
                Profile
              </button>
            </MenuItem>

            {/* Notifications */}
            <MenuItem>
              <button
                onClick={() => navigate("/settings/push-notifications")}
                className="
                  flex items-center gap-3
                  w-full px-4 py-3
                  text-sm text-text
                  hover:bg-surface-2
                  transition-colors
                  hover:cursor-pointer
                "
              >
                <Bell className="w-4 h-4" />
                Notification Settings
              </button>
            </MenuItem>

            {/* Logout */}
            <div className="border-t border-border">
              <MenuItem>
                <button
                  onClick={logout}
                  className="
                    flex items-center gap-3
                    w-full px-4 py-3
                    text-sm text-error
                    hover:bg-error-bg
                    transition-colors
                    hover:cursor-pointer
                  "
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </MenuItem>
            </div>

          </MenuItems>
        </Menu>

      </div>
    </header>
  );
};

export default Header;