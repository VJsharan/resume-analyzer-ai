import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle } from 'lucide-react';
import InputField from '../components/auth/InputField';
import SubmitButton from '../components/auth/SubmitButton';
import ErrorBanner from '../components/auth/ErrorBanner';
import IllustrationPanel from '../components/auth/IllustrationPanel';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) {
        throw new Error('Please enter your email address');
      }
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // TODO: Implement actual password reset logic (Phase 2)
      // In production, this would send a reset link via email

      // Show success state
      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError('');
  };

  const handleSendAnother = () => {
    setIsSuccess(false);
    setEmail('');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* LEFT PANEL - FORM SECTION */}
      <div className="lg:w-2/5 w-full flex items-center justify-center p-6 lg:pl-16 lg:pr-12 lg:py-12 order-2 lg:order-1">
        <div className="w-full max-w-md">
          {!isSuccess ? (
            <>
              {/* Logo and Branding */}
              <div className="mb-10">
                <Link to="/landing" className="inline-flex items-center mb-8 group">
                  <div className="w-11 h-11 bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl flex items-center justify-center
                    group-hover:scale-105 transition-transform shadow-sm">
                    <span className="text-white text-lg font-bold">PS</span>
                  </div>
                  <div className="ml-3">
                    <h1 className="text-base font-semibold text-slate-900">Political Speech Analysis</h1>
                  </div>
                </Link>
                <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Forgot Password?</h2>
                <p className="text-slate-600 text-base">No worries! Enter your email and we'll send you reset instructions.</p>
              </div>

              {/* Error Banner */}
              {error && (
                <ErrorBanner
                  message={error}
                  onRetry={error.includes('Connection') ? handleRetry : undefined}
                />
              )}

              {/* Forgot Password Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input */}
                <InputField
                  id="email"
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  icon={Mail}
                  value={email}
                  onChange={setEmail}
                  required
                  autoComplete="email"
                />

                {/* Send Reset Link Button */}
                <SubmitButton
                  label="Send Reset Link"
                  loadingLabel="Sending..."
                  isLoading={isLoading}
                />
              </form>

              {/* Back to Login */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors group">
                  <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Login
                </Link>
              </div>
            </>
          ) : (
            /* SUCCESS STATE */
            <>
              {/* Logo and Branding */}
              <div className="mb-10">
                <Link to="/landing" className="inline-flex items-center mb-8 group">
                  <div className="w-11 h-11 bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl flex items-center justify-center
                    group-hover:scale-105 transition-transform shadow-sm">
                    <span className="text-white text-lg font-bold">PS</span>
                  </div>
                  <div className="ml-3">
                    <h1 className="text-base font-semibold text-slate-900">Political Speech Analysis</h1>
                  </div>
                </Link>

                {/* Success Icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight text-center">Check Your Email</h2>
                <p className="text-slate-600 text-base text-center mb-2">
                  We've sent password reset instructions to
                </p>
                <p className="text-slate-900 font-semibold text-base text-center mb-6">
                  {email}
                </p>
              </div>

              {/* Instructions */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 mb-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Next Steps:</h3>
                <ol className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start">
                    <span className="text-slate-900 font-semibold mr-2">1.</span>
                    Check your email inbox (and spam folder)
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-900 font-semibold mr-2">2.</span>
                    Click the reset link in the email
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-900 font-semibold mr-2">3.</span>
                    Create a new password
                  </li>
                </ol>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg
                    hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-colors"
                >
                  Back to Login
                </Link>
                <button
                  onClick={handleSendAnother}
                  className="w-full flex items-center justify-center px-6 py-3 bg-white text-slate-700 font-semibold rounded-lg
                    border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-colors"
                >
                  Send Another Email
                </button>
              </div>

              {/* Help Text */}
              <p className="mt-6 text-center text-sm text-slate-500">
                Didn't receive the email? Check your spam folder or contact support.
              </p>
            </>
          )}
        </div>
      </div>

      {/* RIGHT PANEL - ILLUSTRATION SECTION */}
      <IllustrationPanel
        imageSrc="/illustrations/forgot-password.svg"
        imageAlt="Secure Password Recovery - Reset Your Account Access"
        tagline="Secure account recovery, just a few clicks away."
        features={[
          'Secure Password Reset Process',
          'Email Verification Protection',
          'Quick Account Recovery'
        ]}
      />
    </div>
  );
}
