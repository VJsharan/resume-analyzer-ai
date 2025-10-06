import { ArrowRight, Mic, BarChart3, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function HeroSection() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <section className="relative bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200/60 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shadow-sm">
                <Mic className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900">SpeechInsight</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-2">
              <a href="#features" className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 rounded-lg transition-colors">Features</a>
              <a href="#how-it-works" className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 rounded-lg transition-colors">How It Works</a>
              <Link to="/dashboard" className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 rounded-lg transition-colors">Dashboard</Link>
              <div className="w-px h-5 bg-slate-200 mx-1"></div>
              <Link to="/login" className="px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-all shadow-sm hover:shadow">
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-200 bg-white"
            >
              <div className="px-4 py-3 space-y-1">
                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md">Features</a>
                <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md">How It Works</a>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md">Dashboard</Link>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md text-center">Get Started</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-5"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-semibold text-slate-700">AI-Powered Speech Analysis</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold text-slate-900 leading-[1.1] tracking-tight">
              Analyze Political Speeches with Precision
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              Understand empathy, emotion, and communication impact across multiple languages.
              Professional speech analysis for researchers, analysts, and campaign teams.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-all shadow-md hover:shadow-lg"
              >
                Start Analyzing
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 text-slate-900 text-sm font-semibold rounded-lg hover:bg-slate-50 hover:border-slate-900 transition-all"
              >
                View Demo
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 pt-4 border-t border-slate-200">
              <div>
                <div className="text-2xl font-bold text-slate-900">500+</div>
                <div className="text-slate-600 text-xs font-medium">Analysts</div>
              </div>
              <div className="w-px h-10 bg-slate-200"></div>
              <div>
                <div className="text-2xl font-bold text-slate-900">4</div>
                <div className="text-slate-600 text-xs font-medium">Languages</div>
              </div>
              <div className="w-px h-10 bg-slate-200"></div>
              <div>
                <div className="text-2xl font-bold text-slate-900">95%</div>
                <div className="text-slate-600 text-xs font-medium">Accuracy</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative order-first lg:order-last"
          >
            <div className="bg-white border border-slate-200 rounded-xl shadow-xl p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs font-medium text-slate-900">Live Analysis</span>
                </div>
                <div className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded">
                  speech.mp4
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2.5 mb-4">
                <div className="bg-slate-50 rounded-md p-3 border border-slate-100">
                  <div className="text-xs text-slate-600 mb-1">Empathy Score</div>
                  <div className="text-2xl font-bold text-slate-900">8.2</div>
                  <div className="text-xs text-green-600 mt-0.5">+12% vs avg</div>
                </div>
                <div className="bg-slate-50 rounded-md p-3 border border-slate-100">
                  <div className="text-xs text-slate-600 mb-1">Sentiment</div>
                  <div className="text-lg font-bold text-slate-900">Positive</div>
                  <div className="text-xs text-slate-600 mt-0.5">78% confidence</div>
                </div>
              </div>

              {/* Waveform Visualization */}
              <div className="bg-slate-50 rounded-md p-2.5 border border-slate-100 mb-3">
                <div className="flex items-end justify-between h-12 gap-0.5">
                  {[...Array(32)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 bg-slate-900 rounded-t-sm"
                      initial={{ height: '20%' }}
                      animate={{
                        height: ['20%', `${Math.random() * 70 + 30}%`, '20%']
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.05,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Key Themes */}
              <div>
                <div className="text-xs font-medium text-slate-700 mb-2">Key Themes</div>
                <div className="flex flex-wrap gap-1.5">
                  {['Unity', 'Economic Growth', 'Progress'].map((theme) => (
                    <span key={theme} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded border border-slate-200">
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Stats Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="absolute -bottom-3 -right-3 bg-white border border-slate-200 rounded-md shadow-lg p-2.5"
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="h-3.5 w-3.5 text-slate-600" />
                <div>
                  <div className="text-xs text-slate-600">Processing</div>
                  <div className="text-xs font-semibold text-slate-900">45 seconds</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 pt-6 border-t border-slate-200"
        >
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Secure Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Files Auto-Deleted</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
