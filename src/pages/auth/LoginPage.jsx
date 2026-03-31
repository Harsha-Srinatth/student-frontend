import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import Cookies from 'js-cookie';
import api from '../../services/api';
import { registerFCMTokenIfGranted } from '../../services/fcmRegistration';
import { useToast } from '../../contexts/ToastContext';

import AuthLayout from './AuthLayout';
import Input from './components/Input';

const roles = [
  { id: 'student', label: 'Student' },
  { id: 'faculty', label: 'Faculty' },
  { id: 'hod', label: 'HOD' }
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [activeRole, setActiveRole] = useState('student');
  const [loading, setLoading] = useState(false);
  
  const [credentials, setCredentials] = useState({
    identifier: '',
    password: ''
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const getIdentifierLabel = () => {
    switch(activeRole) {
      case 'student': return 'Student ID';
      case 'faculty': return 'Faculty ID / Email Address';
      case 'hod': return 'HOD ID';
      default: return 'ID';
    }
  };

  const getIdentifierName = () => {
     switch(activeRole) {
       case 'student': return 'studentid';
       case 'faculty': return 'email';
       case 'hod': return 'hodId';
       default: return 'id';
     }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.identifier || !credentials.password) {
      addToast('Please fill in all fields', 'error');
      return;
    }

    setLoading(true);
    try {
      let endpoint = '';
      let payload = { password: credentials.password };
      
      payload[getIdentifierName()] = credentials.identifier.trim();

      if (activeRole === 'student') endpoint = '/login/as/student';
      if (activeRole === 'faculty') endpoint = '/login/as/faculty';
      if (activeRole === 'hod') endpoint = '/hod/login';

      const response = await api.post(endpoint, payload);
      const { token, user } = response.data;

      const cookieOpts = { expires: 7, secure: typeof window !== 'undefined' && window.location.protocol === 'https:' };
      Cookies.set('token', token, cookieOpts);
      Cookies.set('userRole', activeRole, cookieOpts);
      
      if (activeRole === 'student') Cookies.set('userId', user.studentid, cookieOpts);
      if (activeRole === 'faculty') Cookies.set('userId', user.facultyid, cookieOpts);
      if (activeRole === 'hod') {
        Cookies.set('hodId', user.hodId, cookieOpts);
        Cookies.set('collegeId', user.collegeId, cookieOpts);
        if (user.department) Cookies.set('department', user.department, cookieOpts);
      }

      if (activeRole === 'student' || activeRole === 'faculty') {
         registerFCMTokenIfGranted();
      }

      addToast(`Welcome back, ${user.fullname || user.username || 'User'}!`, 'success');
      
      if ((activeRole === 'student' || activeRole === 'faculty') && !user.hasProfilePic) {
         navigate(`/${activeRole}/profile-img/upload`);
      } else if (activeRole === 'hod') {
         navigate('/hod/dashboard');
      } else {
         navigate('/');
      }

    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Login failed. Please verify your credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in to your account"
      subtitle="Enter your details below to access your workspace"
    >
      <div className="flex p-1 mb-8 bg-slate-100/80 rounded-lg">
        {roles.map((role) => {
          const isActive = activeRole === role.id;
          return (
            <button
              key={role.id}
              onClick={() => {
                setActiveRole(role.id);
                setCredentials({ identifier: '', password: '' });
              }}
              className={`relative flex-1 py-1.5 rounded-md transition-all text-[13.5px] font-semibold ${
                isActive ? 'text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
              type="button"
            >
              {isActive && (
                <motion.div
                  layoutId="activeRoleTabLogin"
                  className="absolute inset-0 bg-white rounded-md shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                  transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
                />
              )}
              <span className="relative z-10">{role.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole + '-inputs'}
            initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 5 }} transition={{ duration: 0.2 }}
            className="flex flex-col gap-4"
          >
            <Input
              label={getIdentifierLabel()}
              type={activeRole === 'faculty' ? 'email' : 'text'}
              name="identifier"
              value={credentials.identifier}
              onChange={handleChange}
              placeholder={`Enter your ${getIdentifierLabel().toLowerCase()}`}
              autoComplete={activeRole === 'faculty' ? 'email' : 'username'}
              required
            />
            
            <Input
              label="Password"
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between pt-1 pb-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900/20" />
            <span className="text-[13px] font-medium text-slate-600 group-hover:text-slate-900">Remember me</span>
          </label>
          <a href="#" onClick={(e) => { e.preventDefault(); addToast('Password recovery coming soon.', 'info'); }} className="text-[13px] font-semibold text-emerald-600 hover:text-emerald-700 hover:underline">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2 font-semibold text-[14.5px] transition-all ${
            loading 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-[0_1px_2px_rgba(0,0,0,0.05)]'
          }`}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
        </button>
      </form>

      <div className="mt-8 text-center pt-6 border-t border-slate-100">
        <p className="text-slate-500 text-[13.5px]">
          Don't have an account?{' '}
          <Link to="/register" className="text-emerald-600 font-semibold hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
