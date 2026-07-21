import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, PlusCircle, Sparkles, BookOpen, User, History } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/log', label: 'Log', icon: PlusCircle },
  { to: '/history', label: 'History', icon: History },
  { to: '/insights', label: 'Insights', icon: Sparkles },
  { to: '/learn', label: 'Learn', icon: BookOpen },
  { to: '/profile', label: 'Profile', icon: User }
];

export default function BottomNav() {
  return (
    <nav className="no-print fixed bottom-0 left-0 right-0 z-50 px-4 pb-3">
      <div className="max-w-2xl mx-auto glass-nav rounded-[22px] flex items-center justify-around h-16 px-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : ''}`}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}