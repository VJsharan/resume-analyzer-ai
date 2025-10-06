import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import AnalysisPage from './pages/AnalysisPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import EnhancedReportsPage from './pages/EnhancedReportsPage';
import ComparePage from './pages/ComparePage';
import CompareResultsPage from './pages/CompareResultsPage';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing page as home page without Layout (has its own navigation) */}
        <Route path="/" element={<LandingPage />} />

        {/* Login page without Layout (standalone page) */}
        <Route path="/login" element={<LoginPage />} />

        {/* Forgot Password page without Layout (standalone page) */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* App pages with Layout (sidebar navigation) */}
        <Route path="/uploads" element={<Layout><HomePage /></Layout>} />
        <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
        <Route path="/history" element={<Layout><HistoryPage /></Layout>} />
        <Route path="/analysis/:speechId" element={<Layout><AnalysisPage /></Layout>} />
        <Route path="/reports" element={<Layout><EnhancedReportsPage /></Layout>} />
        <Route path="/compare" element={<Layout><ComparePage /></Layout>} />
        <Route path="/compare/results" element={<Layout><CompareResultsPage /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
