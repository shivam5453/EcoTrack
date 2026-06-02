import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, Settings, User, LogOut, ChevronDown, PlusCircle } from 'lucide-react';
import useAuth from '../hooks/useAuth';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate('/login');
  };

  // Get initials for user avatar
  const getInitials = () => {
    if (!user || !user.name) return 'ET';
    const parts = user.name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left: Brand Logo & Navigation */}
          <div className="flex items-center gap-4">
            {location.pathname !== '/' && (
              <>
                <button 
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-bold text-sm transition-colors cursor-pointer"
                >
                  &larr; Back
                </button>
                <div className="w-px h-5 bg-slate-200 dark:bg-slate-700" />
              </>
            )}
            
            <Link to="/" className="flex items-center gap-2 group" title="Home">
              <div className="p-2 bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-xl group-hover:scale-105 transition-transform duration-200">
                <Leaf size={20} className="fill-emerald-500/20" />
              </div>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight hidden sm:block">
                Eco<span className="text-emerald-600 dark:text-emerald-500">Track</span>
              </span>
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Calculate CTA Button */}
                <Link
                  to="/calculate"
                  className={`
                    flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm
                    ${location.pathname === '/calculate'
                      ? 'bg-emerald-700 text-white dark:bg-emerald-600 shadow-emerald-500/10'
                      : 'bg-emerald-600 hover:bg-emerald-750 text-white shadow-emerald-500/10 hover:shadow-emerald-500/20'
                    }
                  `}
                >
                  <PlusCircle size={14} />
                  <span className="hidden sm:inline">Calculate</span>
                </Link>

                {/* Settings Quick Access Icon */}
                <Link
                  to="/settings"
                  className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200"
                  aria-label="Settings"
                >
                  <Settings size={18} />
                </Link>

                {/* Vertical Divider */}
                <span className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

                {/* User Profile Avatar Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 cursor-pointer"
                  >
                    {/* Initials Avatar */}
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center border border-emerald-550/20 shadow-inner">
                      {getInitials()}
                    </div>
                    <ChevronDown size={14} className={`text-slate-450 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Card */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-2 animate-[slideIn_0.2s_ease-out] z-50">
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800/80 mb-1.5">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Signed In As</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-slate-450 dark:text-slate-500 truncate">{user.email}</p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold transition-all duration-200"
                      >
                        <User size={15} />
                        View Profile
                      </Link>

                      <Link
                        to="/settings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold transition-all duration-200"
                      >
                        <Settings size={15} />
                        Settings
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-rose-600 dark:text-rose-450 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-xs font-bold transition-all duration-200 text-left cursor-pointer"
                      >
                        <LogOut size={15} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold text-slate-650 hover:text-slate-900 dark:text-slate-350 dark:hover:text-white rounded-xl transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
