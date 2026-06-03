'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Check, AlertCircle } from 'lucide-react';
import { useAuthStore, type UserRole } from '@/lib/store';
import { setSessionCookie } from '@/lib/session';
import { GlassCard } from '@/components/GlassCard';
import { RoleSwitcher } from '@/components/RoleSwitcher';

export default function AuthPage() {
  const router = useRouter();
  const { setLoggedIn, setUserData, setCurrentScreen, userRole } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ageVerified, setAgeVerified] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'credentials' | 'age' | 'complete'>('credentials');

  const handleContinue = () => {
    setError('');
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Validate password strength (minimum 6 characters)
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    // Simulate verification check - in production, this would call your API
    // For now, we allow login but mark as verified
    setStep('age');
  };

  const handleAgeVerify = () => {
    if (!ageVerified) return;
    
    const userData = {
      email: email,
      name: 'User',
    };
    setUserData(userData);
    setLoggedIn(true);
    
    // Set session cookie for middleware validation
    setSessionCookie({
      role: userRole,
      email: userData.email,
      name: userData.name,
      region: 'Dubai, UAE',
    });
    
    // Route based on role
    const screenMap: Record<UserRole, string> = {
      CUSTOMER: '/customer/home',
      VENDOR: '/vendor/dashboard',
      ADMIN: '/admin/dashboard',
    };
    const redirectPath = screenMap[userRole] || '/customer/home';
    setCurrentScreen(
      userRole === 'CUSTOMER' ? 'CUSTOMER_DASHBOARD' : userRole === 'VENDOR' ? 'VENDOR_PORTAL' : 'ADMIN_PANEL'
    );
    setStep('complete');
    router.push(redirectPath);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 flex items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-amber-50 via-white to-transparent opacity-80 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center gap-6 text-center mb-10">
          <div className="inline-flex flex-col items-center gap-4 rounded-3xl border border-slate-200 bg-white/90 px-6 py-6 shadow-xl shadow-slate-200/60">
            <img src="/logo.png" alt="SheeshaTonight" className="h-16 w-auto" />
            <div>
              <div className="text-3xl font-black tracking-tight text-slate-900">SheeshaTonight</div>
              <p className="mt-2 text-sm text-slate-500">Luxury sheesha rental and tobacco marketplace</p>
            </div>
          </div>
        </div>

        {/* Role Switcher */}
        <div className="mb-6 relative z-10">
          <RoleSwitcher />
        </div>

        {/* Main Card */}
        <GlassCard className="p-8 relative z-10">
          {step === 'credentials' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
              
              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-2xl">
                  <AlertCircle size={20} className="text-rose-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-rose-700">{error}</p>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="text-sm text-slate-700 font-semibold mb-2 block">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="your@email.ae"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="text-sm text-slate-700 font-semibold mb-2 block">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition"
                />
              </div>

              <div className="flex justify-between items-center gap-4">
                <div />
                <Link href="/forgot-password" className="text-sm font-medium text-amber-600 hover:text-amber-700 transition">
                  Forgot password?
                </Link>
              </div>

              <button
                onClick={handleContinue}
                disabled={!email.trim() || !password.trim()}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold rounded-2xl hover:shadow-lg hover:shadow-amber-300/40 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <Lock size={18} className="inline mr-2" />
                Sign In
              </button>
            </div>
          )}

          {step === 'age' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Age Verification</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Sheesha and tobacco products are restricted to users 18+ (UAE) or 21+ (UK). Please verify your age to continue.
              </p>

              {/* Age Checkbox */}
              <label className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100 transition group">
                <input
                  type="checkbox"
                  checked={ageVerified}
                  onChange={(e) => setAgeVerified(e.target.checked)}
                  className="mt-1 w-5 h-5 accent-amber-500"
                />
                <div>
                  <p className="text-slate-900 font-semibold mb-1">I confirm I am of legal age</p>
                  <p className="text-slate-500 text-xs">
                    I declare that I am 18+ (UAE) or 21+ (UK) and legally permitted to rent or view tobacco essentials in my jurisdiction.
                  </p>
                </div>
              </label>

              {/* Approve Button */}
              <button
                onClick={handleAgeVerify}
                disabled={!ageVerified}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold rounded-2xl hover:shadow-lg hover:shadow-amber-300/40 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <Check size={18} className="inline mr-2" />
                Verify & Continue
              </button>
            </div>
          )}

          {step === 'complete' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <Check size={32} className="text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Welcome!</h2>
              <p className="text-slate-600">Redirecting to your dashboard...</p>
            </div>
          )}
        </GlassCard>

        {/* Disclaimer */}
        <p className="text-center text-xs text-slate-500 mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
