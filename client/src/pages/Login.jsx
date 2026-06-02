import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Leaf } from 'lucide-react';
import useAuth from '../hooks/useAuth';

export const Login = () => {
  const { user, login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const destination = location.state?.from?.pathname || '/';
      navigate(destination, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const res = await login(email, password, rememberMe);
    if (!res.success) {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 sm:p-6 transition-colors duration-200">
      
      {/* Absolute Decorative Blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-500/10 dark:bg-blue-500/5 rounded-full filter blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full max-w-md bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        
        {/* Brand/Logo */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 rounded-2xl animate-pulse">
            <Leaf size={28} className="fill-emerald-500/20" />
          </div>
          <h1 className="text-2xl font-black text-slate-950 dark:text-white tracking-tight">
            Eco<span className="text-emerald-600 dark:text-emerald-505">Track</span>
          </h1>
          <p className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest text-center">
            Calculate. Reduce. Neutralize.
          </p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-650 dark:text-rose-400 p-4 rounded-2xl text-xs font-bold mb-6">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider pl-1">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Mail size={16} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. nature@saver.com"
                className="block w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-850/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-850 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 text-sm font-semibold transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider pl-1">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Lock size={16} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-850/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-850 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 text-sm font-semibold transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-650 cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember Me Box */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4.5 h-4.5 rounded text-emerald-600 border-slate-200 focus:ring-emerald-500 dark:border-slate-800 cursor-pointer accent-emerald-500"
              />
              <span className="text-xs font-bold text-slate-500 dark:text-slate-455 group-hover:text-slate-800 dark:group-hover:text-slate-350 transition-colors">
                Remember me
              </span>
            </label>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-550 dark:hover:bg-emerald-600 text-white text-sm font-extrabold shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-4 cursor-pointer"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent mx-auto"></div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer Redirect */}
        <p className="text-xs font-bold text-center text-slate-500 dark:text-slate-455 mt-6">
          New to EcoTrack?{' '}
          <Link to="/register" className="text-emerald-600 dark:text-emerald-500 hover:underline">
            Create an Account
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
