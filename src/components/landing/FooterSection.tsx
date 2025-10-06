import { Mic } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FooterSection() {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-8 pb-5">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6 mb-8">
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link to="/history" className="hover:text-white transition-colors">History</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Upload</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#careers" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#blog" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#docs" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#api" className="hover:text-white transition-colors">API</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#privacy" className="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#terms" className="hover:text-white transition-colors">Terms</a></li>
              <li><a href="#security" className="hover:text-white transition-colors">Security</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-5 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center">
              <Mic className="h-3.5 w-3.5 text-slate-900" />
            </div>
            <div>
              <div className="text-white text-sm font-semibold">SpeechInsight</div>
              <div className="text-xs text-slate-500">© {new Date().getFullYear()} All rights reserved</div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
