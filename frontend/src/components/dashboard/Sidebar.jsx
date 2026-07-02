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
  X,
  LockIcon,
  AlertTriangle,
  Logs,
  XCircle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();
  const location = useLocation();



  const navItems = user?.role === 'admin' 
    ? [
        { name: 'Admin Dashboard', path: '/admin-dashboard', icon: ShieldCheck },
        { name: 'Request Logs', path:'/request-logs', icon:Logs},
        { name: 'Error Logs', path:'/error-logs', icon:AlertTriangle},
        { name: 'Failed Operations', path:'/failed-operations', icon:XCircle}
        
      ]
    : [
        { name: 'Family Dashboard', path: '/dashboard/family', icon: LayoutDashboard, requiresFamily: true },
        { name: 'My Dashboard', path: '/dashboard/individual', icon: User, requiresFamily: true },
        { name: 'Transactions', path: '/transactions', icon: ArrowRightLeft, requiresFamily: true },
        { name: 'Categories', path: '/categories', icon: List, requiresFamily: true },
        { name: 'Labels', path: '/labels', icon: Tag, requiresFamily: true },
        { name: 'Goals', path: '/goals', icon: Target, requiresFamily: true },
        { name: 'Notifications', path: '/notifications', icon: Bell, requiresFamily: true },
        { name: 'Family', path: '/family', icon: Users, requiresFamily: true },
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
            MoneyNest
          </Link>
          <button 
            className="md:hidden p-2 text-text hover:bg-black/5 dark:hover:bg-white/10 rounded-lg"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            const isDisabled = item.requiresFamily && (!user?.familyId || user?.familyId == null);


              if (isDisabled) {
                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between px-4 py-3 rounded-xl font-medium text-muted opacity-50 cursor-not-allowed"
                  >
                    {/* LEFT: icon + name */}
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      {item.name}
                    </div>

                    {/* RIGHT: locked badge */}
                    <span className="text-[10px] p-2 rounded-lg bg-muted/10">
                      <LockIcon className="w-4 h-4" />
                    </span>
                  </div>
                );
              }
            return (
              
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)} // Close on mobile navigation
                className={`flex items-center gap-3 px-2 py-3 rounded-xl font-medium transition-all ${
                  isActive 
                    ? 'bg-primary/10 text-primary shadow-sm ' 
                    : 'text-muted hover:bg-black/5 dark:hover:bg-white/10 hover:text-text'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-muted'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
