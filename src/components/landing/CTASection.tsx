import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CTASection() {
  return (
    <section className="py-10 sm:py-14 bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-xl p-5 sm:p-6 lg:p-7">
          <div className="grid lg:grid-cols-2 gap-5 items-center">
            {/* Left Column - CTA Content */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2.5">
                Ready to Start Analyzing Speeches?
              </h2>
              <p className="text-lg text-slate-600 mb-4">
                Join 500+ analysts, researchers, and campaign teams using SpeechInsight for professional speech analysis.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-all shadow-md hover:shadow-lg"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 text-slate-900 text-sm font-semibold rounded-lg hover:bg-slate-50 hover:border-slate-900 transition-all"
                >
                  View Demo
                </Link>
              </div>
            </div>

            {/* Right Column - Features List */}
            <div>
              <div className="space-y-3">
                {[
                  'Upload and analyze speeches instantly',
                  'Support for 4+ languages (Hindi, English, Marathi, Tamil)',
                  'Empathy scores and sentiment analysis',
                  'Export comprehensive reports',
                  'Secure processing—files deleted after analysis'
                ].map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-slate-900 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-sm text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
