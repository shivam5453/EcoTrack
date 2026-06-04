import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, ShieldAlert, Key, Trash2 } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import useCarbon from '../hooks/useCarbon';
import Badges from '../components/Badges';

export const Profile = () => {
  const { user, updateProfile, deleteAccount, loading } = useAuth();
  const { entries, fetchHistory } = useCarbon();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchHistory(1, 100).catch(() => {});
  }, [fetchHistory]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email) {
      setError('Name and Email are required.');
      return;
    }

    if (password && password.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const res = await updateProfile(name, email, password || undefined);
    if (res.success) {
      setSuccess('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } else {
      setError(res.message || 'Profile update failed.');
    }
  };

  const handleDeleteAccount = async () => {
    setError('');
    const res = await deleteAccount();
    if (res.success) {
      navigate('/register', { replace: true });
    } else {
      setError(res.message || 'Account deletion failed.');
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-8 space-y-8 animate-[slideIn_0.3s_ease-out]">
      
      {/* Title */}
      <div className="space-y-1 pl-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          Your Profile
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-455 font-semibold">
          Manage your account credentials, login details, and profile configurations.
        </p>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-650 dark:text-rose-400 p-4 rounded-2xl text-xs font-bold">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-450 p-4 rounded-2xl text-xs font-bold animate-pulse">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        
        {/* Profile Modification Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider">
            Account Credentials
          </h3>

          <form onSubmit={handleUpdateProfile} className="space-y-5">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider block pl-1">
                Full Name
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
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-850/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-850 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider block pl-1">
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
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-850/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-850 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold transition-all"
                />
              </div>
            </div>

            <span className="h-px bg-slate-100 dark:bg-slate-800 block my-6" />

            <h4 className="text-xs font-black text-slate-850 dark:text-slate-350 uppercase tracking-wider flex items-center gap-1.5 mb-4">
              <Key size={14} className="text-slate-450" /> Update Password (Optional)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider block pl-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-850/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-850 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold transition-all"
                />
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider block pl-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-850/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-850 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold transition-all"
                />
              </div>
            </div>

            {/* Save Buttons */}
            <div className="pt-4 text-right">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-emerald-605 hover:bg-emerald-700 dark:bg-emerald-550 dark:hover:bg-emerald-600 text-white font-extrabold text-xs rounded-2xl transition-all shadow-md shadow-emerald-500/5 cursor-pointer"
              >
                {loading ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Achievements Section */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <Badges history={entries} />
        </div>

        {/* Account Deletion Warning Area */}
        <div className="bg-red-500/5 dark:bg-red-950/10 border border-red-500/20 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-rose-500/10 text-rose-600 rounded-2xl shrink-0">
              <ShieldAlert size={22} />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-black text-rose-700 dark:text-rose-455 uppercase tracking-wider leading-none">
                Danger Zone
              </h3>
              <p className="text-xs text-rose-650 dark:text-rose-400 font-semibold leading-relaxed">
                Permanently delete your profile and erase all historical carbon logs. This action is irreversible and all saved entries will be erased from MongoDB databases.
              </p>
            </div>
          </div>

          {/* Delete triggers */}
          {showDeleteConfirm ? (
            <div className="bg-white dark:bg-slate-900 border border-rose-500/30 rounded-2xl p-5 space-y-4 animate-[slideIn_0.2s_ease-out]">
              <p className="text-xs font-black text-slate-900 dark:text-white text-center">
                Are you absolutely sure? This will delete ALL records!
              </p>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Yes, Delete My Account
                </button>
              </div>
            </div>
          ) : (
            <div className="text-right">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-6 py-3 bg-rose-650 hover:bg-rose-700 text-white font-extrabold text-xs rounded-2xl transition-all shadow-md shadow-rose-500/10 ml-auto cursor-pointer"
              >
                <Trash2 size={14} /> Delete EcoTrack Account
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
