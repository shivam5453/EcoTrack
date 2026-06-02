import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Leaf, 
  LayoutDashboard, 
  Calculator, 
  User as UserIcon, 
  LogOut, 
  Sun, 
  Moon, 
  Menu, 
  X,
  ChevronRight
} from 'lucide-react';

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const navItems = [
    { name: 'Home / Insights', path: '/', icon: Leaf, protected: false },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, protected: true },
    { name: 'Calculator', path: '/calculate', icon: Calculator, protected: true },
    { name: 'My Profile', path: '/profile', icon: UserIcon, protected: true },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const activeClass = (path) => {
    return location.pathname === path
      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 font-semibold'
      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-350 dark:hover:bg-slate-800/50 dark:hover:text-slate-105';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-300">
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-emerald-500 text-white p-1.5 rounded-lg flex items-center justify-center">
              <Leaf size={20} className="fill-emerald-100/20" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
              EcoTrack
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Light/Dark Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* User Section */}
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{user.name}</span>
                <span className="text-xs text-slate-400 dark:text-slate-500 capitalize">{user.city}</span>
              </div>
              
              <Link 
                to="/profile" 
                className="h-9 w-9 rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center font-bold text-sm uppercase border border-emerald-500/20"
              >
                {user.name.charAt(0)}
              </Link>

              <button
                onClick={handleLogout}
                className="hidden sm:flex p-2 items-center gap-1.5 text-slate-500 hover:text-red-500 hover:bg-red-50/50 dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                title="Log out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link 
                to="/login"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-350 dark:hover:text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/register"
                className="text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 px-4 py-2 rounded-lg transition-all shadow-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 flex relative">
        {/* Sidebar navigation */}
        <aside 
          className={`
            fixed inset-y-0 left-0 top-[73px] z-30 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 
            transform lg:transform-none lg:opacity-100 transition-all duration-300 ease-in-out flex flex-col justify-between p-4
            ${sidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-0 -translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="space-y-6">
            <div className="px-3 py-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Navigation Menu
            </div>
            
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                if (item.protected && !user) return null;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group ${activeClass(item.path)}`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} className="group-hover:scale-105 transition-transform" />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-slate-400" />
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User profile footer in sidebar */}
          {user && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              <div className="sm:hidden flex items-center justify-between py-2">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{user.name}</span>
                  <span className="text-xs text-slate-400">{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-red-500 bg-red-50 dark:bg-red-950/20 rounded-lg"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/10 dark:border-emerald-500/5 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1.5">
                  <Leaf size={14} className="fill-emerald-400/10" />
                  <span className="text-xs font-semibold uppercase tracking-wider">EcoTip of the Day</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Switching to LEDs saves up to 75% more energy compared to old incandescent bulbs!
                </p>
              </div>
            </div>
          )}
        </aside>

        {/* Sidebar mobile overlay */}
        {sidebarOpen && (
          <div 
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 top-[73px] bg-slate-900/20 dark:bg-slate-950/50 backdrop-blur-sm z-20 lg:hidden"
          />
        )}

        {/* Page Content viewport wrapper */}
        <main className="flex-1 min-w-0 lg:pl-64 p-6 lg:p-8 flex flex-col overflow-y-auto">
          <div className="flex-1 max-w-7xl w-full mx-auto animate-[page-fade-enter_0.3s_ease-out]">
            {children}
          </div>

          <footer className="mt-16 pt-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
            <p>© {new Date().getFullYear()} EcoTrack Carbon Intelligence Platform. Built for B.Tech Major Project.</p>
            <p className="mt-1">Educate. Calculate. Track. Reduce. Protect our biosphere.</p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
