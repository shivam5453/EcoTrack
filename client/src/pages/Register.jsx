import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Leaf } from 'lucide-react';
import useAuth from '../hooks/useAuth';

export const Register = () => {
  const { user, register, loading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [strength, setStrength] = useState({ score: 0, label: 'Very Weak', color: 'bg-rose-500' });

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  // Dynamic Password Strength Calculator
  useEffect(() => {
    if (!password) {
      setStrength({ score: 0, label: 'Too Short', color: 'bg-slate-200 dark:bg-slate-800' });
      return;
    }

    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    let label = 'Weak';
    let color = 'bg-rose-500';

    if (score <= 1) {
      label = 'Weak';
      color = 'bg-rose-500';
    } else if (score === 2 || score === 3) {
      label = 'Medium';
      color = 'bg-amber-500';
    } else if (score >= 4) {
      label = 'Strong';
      color = 'bg-emerald-500';
    }

    setStrength({ score, label, color });
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const res = await register(name, email, password);
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
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 rounded-2xl animate-pulse">
            <Leaf size={24} className="fill-emerald-500/20" />
          </div>
          <h1 className="text-xl font-black text-slate-950 dark:text-white tracking-tight">
            Create an Account
          </h1>
          <p className="text-xs text-slate-450 dark:text-slate-500 text-center">
            Join EcoTrack to track your carbon outputs.
          </p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-650 dark:text-rose-400 p-4 rounded-2xl text-xs font-bold mb-5 animate-bounce">
            {error}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-550 dark:text-slate-450 uppercase tracking-wider pl-1">
              Your Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <User size={16} />
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-850/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-850 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 text-sm font-semibold transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-550 dark:text-slate-455 uppercase tracking-wider pl-1">
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
                className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-850/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-850 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 text-sm font-semibold transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-550 dark:text-slate-455 uppercase tracking-wider pl-1 flex justify-between">
              <span>Password</span>
              <span className="text-[9px] lowercase font-semibold opacity-60">min 6 chars</span>
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
                className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-850/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-850 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 text-sm font-semibold transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-650 cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Dynamic Password Strength Indicator Bar */}
            {password && (
              <div className="space-y-1 pt-1.5 px-1">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                  <span>Strength:</span>
                  <span className={strength.label === 'Strong' ? 'text-emerald-500' : strength.label === 'Medium' ? 'text-amber-500' : 'text-rose-500'}>
                    {strength.label}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex gap-0.5">
                  <div className={`h-full flex-1 transition-all ${strength.score >= 1 ? strength.color : 'bg-slate-100 dark:bg-slate-800'}`} />
                  <div className={`h-full flex-1 transition-all ${strength.score >= 3 ? strength.color : 'bg-slate-100 dark:bg-slate-800'}`} />
                  <div className={`h-full flex-1 transition-all ${strength.score >= 5 ? strength.color : 'bg-slate-100 dark:bg-slate-800'}`} />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-550 dark:text-slate-455 uppercase tracking-wider pl-1">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Lock size={16} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-850/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-850 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 text-sm font-semibold transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-550 dark:hover:bg-emerald-600 text-white text-sm font-extrabold shadow-lg shadow-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-4 cursor-pointer"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent mx-auto"></div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Footer Redirect */}
        <p className="text-xs font-bold text-center text-slate-500 dark:text-slate-455 mt-5">
          Already registered?{' '}
          <Link to="/login" className="text-emerald-600 dark:text-emerald-500 hover:underline">
            Sign In Here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
