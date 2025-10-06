import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import InputField from '../components/auth/InputField';
import SubmitButton from '../components/auth/SubmitButton';
import ErrorBanner from '../components/auth/ErrorBanner';
import IllustrationPanel from '../components/auth/IllustrationPanel';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Basic validation
      if (!email || !password) {
        throw new Error('Please fill in all fields');
      }

      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

      // Call authentication API
      const response = await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Authentication failed' }));
        throw new Error(errorData.detail || 'Invalid email or password');
      }

      const data = await response.json();

      // Store auth token and user info
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* LEFT PANEL - FORM SECTION */}
      <div className="lg:w-2/5 w-full flex items-center justify-center p-6 lg:pl-16 lg:pr-12 lg:py-12 order-2 lg:order-1">
        <div className="w-full max-w-md">
          {/* Logo and Branding */}
          <div className="mb-10">
            <Link to="/" className="inline-flex items-center mb-8 group">
              <div className="w-11 h-11 bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl flex items-center justify-center
                group-hover:scale-105 transition-transform shadow-sm">
                <span className="text-white text-lg font-bold">PS</span>
              </div>
              <div className="ml-3">
                <h1 className="text-base font-semibold text-slate-900">Political Speech Analysis</h1>
              </div>
            </Link>
            <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Welcome Back</h2>
            <p className="text-slate-600 text-base">Sign in to continue to your dashboard</p>
          </div>

          {/* Error Banner */}
          {error && (
            <ErrorBanner
              message={error}
              onRetry={error.includes('Connection') ? handleRetry : undefined}
            />
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <InputField
              id="email"
              label="Email or Username"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              value={email}
              onChange={setEmail}
              required
              autoComplete="email"
            />

            {/* Password Input */}
            <InputField
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={setPassword}
              required
              autoComplete="current-password"
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 border-2 border-slate-300 rounded text-slate-900 focus:ring-slate-900 focus:ring-2 cursor-pointer"
                />
                <span className="ml-2 text-sm text-slate-700 group-hover:text-slate-900 transition-colors">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <SubmitButton
              label="Sign In"
              loadingLabel="Signing In..."
              isLoading={isLoading}
            />
          </form>

          {/* Back to Home */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <Link to="/" className="flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors group">
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - ILLUSTRATION SECTION */}
      <IllustrationPanel
        imageSrc="/illustrations/login-hero.svg"
        imageAlt="Political Speech Analysis Platform - Empathy and Communication Insights"
        tagline="Empowering leaders to communicate better, one speech at a time."
        features={[
          'AI-Powered Empathy Analysis',
          'Multilingual Speech Recognition',
          'Actionable Communication Insights'
        ]}
      />
    </div>
  );
}
