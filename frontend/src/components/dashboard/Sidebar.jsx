import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  UserPlus,
  ArrowRightLeft, 
  List, 
  Tag, 
  Target, 
  Bell, 
  Users, 
  ShieldCheck, 
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const navItems = user?.role === 'admin' 
    ? [
        { name: 'Admin Dashboard', path: '/admin-dashboard', icon: ShieldCheck }
      ]
    : [
        { name: 'Combined Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Individual Dashboard', path: '/individual-dashboard', icon: User },
        { name: 'Transactions', path: '/transactions', icon: ArrowRightLeft },
        { name: 'Categories', path: '/categories', icon: List },
        { name: 'Labels', path: '/labels', icon: Tag },
        { name: 'Goals', path: '/goals', icon: Target },
        { name: 'Reminders', path: '/reminders', icon: Bell },
        { name: 'Family', path: '/family', icon: Users },
        ...(user?.role === 'familyAdmin' ? [{ name: 'Manage Family', path: '/family/manage', icon: Users }] : [])
      ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`fixed md:static inset-y-0 left-0 w-64 bg-surface border-r border-border h-full flex flex-col shadow-sm transition-transform duration-300 z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
          <Link to="/dashboard" className="text-2xl font-extrabold tracking-tight text-primary">
            WealthNest
          </Link>
          <button 
            className="md:hidden p-2 text-text hover:bg-black/5 dark:hover:bg-white/10 rounded-lg"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)} // Close on mobile navigation
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive 
                    ? 'bg-primary/10 text-primary shadow-sm border border-primary/10' 
                    : 'text-muted hover:bg-black/5 dark:hover:bg-white/10 hover:text-text'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-muted'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-500 font-medium rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
