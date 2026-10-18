import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { portfolioApi } from '../lib/api';
import BentoTemplate from '../components/templates/BentoTemplate';
import TerminalTemplate from '../components/templates/TerminalTemplate';
import ExecutiveTemplate from '../components/templates/ExecutiveTemplate';
import RecruiterChatbot from '../components/portfolio/RecruiterChatbot';
import { ArrowLeft, Loader2, Sparkles, Edit3 } from 'lucide-react';
import { DEFAULT_PORTFOLIO } from '../lib/portfolioStore';

export const PortfolioView = () => {
  const { id } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true);
      setError(null);

      // If id is demo, load default demo immediately
      if (id === 'demo' || id === 'aryan-sharma') {
        setPortfolio(DEFAULT_PORTFOLIO);
        setLoading(false);
        return;
      }

      try {
        const res = await portfolioApi.get(id);
        if (res.success && res.data) {
          setPortfolio(res.data);
        } else {
          setPortfolio(DEFAULT_PORTFOLIO);
        }
      } catch (err) {
        console.warn('Could not load portfolio from server, showing sample profile:', err);
        setPortfolio(DEFAULT_PORTFOLIO);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center gap-4 font-sans">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-sm text-neutral-400">Loading portfolio...</p>
      </div>
    );
  }

  const templateType = portfolio?.template || 'bento';

  return (
    <div className="relative min-h-screen">
      {/* Top Floating Navigation Bar */}
      <div className="fixed top-4 left-4 z-40 flex items-center gap-2">
        <Link
          to="/builder"
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-neutral-900/90 hover:bg-neutral-800 text-white text-xs font-medium border border-neutral-700/80 shadow-lg backdrop-blur-md transition-all cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Edit in Builder</span>
        </Link>
      </div>

      {/* Render Selected Template */}
      {templateType === 'terminal' ? (
        <TerminalTemplate portfolio={portfolio} />
      ) : templateType === 'executive' ? (
        <ExecutiveTemplate portfolio={portfolio} />
      ) : (
        <BentoTemplate portfolio={portfolio} />
      )}

      {/* Floating Recruiter AI Widget */}
      <RecruiterChatbot portfolio={portfolio} />
    </div>
  );
};

export default PortfolioView;
