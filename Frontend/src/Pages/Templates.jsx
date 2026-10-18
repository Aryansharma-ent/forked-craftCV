import React from 'react';
import { useNavigate } from 'react-router';
import { Terminal, Layers, FileText, ArrowRight, Sparkles, CheckCircle2, ChevronLeft } from 'lucide-react';

const TEMPLATES = [
  {
    id: 'bento',
    name: 'Modern Bento 3D Grid',
    badge: 'Popular',
    description: 'Sleek dark-mode Bento layout featuring interactive project cards, ambient 3D glow, and real-time social links.',
    features: ['Dark Mode Aesthetic', 'Categorized Tech Stack', 'GitHub & Live Demo Badges', 'Embedded Recruiter AI'],
    icon: Layers,
    color: 'from-blue-600 to-indigo-600',
    accentBorder: 'border-blue-500/30'
  },
  {
    id: 'terminal',
    name: 'Hacker CLI Terminal',
    badge: 'Interactive',
    description: 'A genuine interactive terminal emulator where recruiters can run bash commands (bio, skills, projects, contact) to explore your profile.',
    features: ['Real Command Parser', 'Clickable Quick Run Buttons', 'Retro Green/Black Monospace', 'Zero High-School Level Forms'],
    icon: Terminal,
    color: 'from-emerald-600 to-teal-600',
    accentBorder: 'border-emerald-500/30'
  },
  {
    id: 'executive',
    name: 'Executive Minimalist (ATS)',
    badge: 'ATS Ready',
    description: 'Clean, publication-ready typography tailored for traditional technical recruiters and direct PDF export.',
    features: ['Print & PDF Optimized', 'Clean Grid Structure', 'Fast Scannability', 'Formal Tech Representation'],
    icon: FileText,
    color: 'from-purple-600 to-pink-600',
    accentBorder: 'border-purple-500/30'
  }
];

export const Templates = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      {/* Top Navbar */}
      <header className="border-b border-neutral-900 bg-black/80 backdrop-blur-md sticky top-0 z-30 px-6 sm:px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Home
          </button>
          <div className="h-4 w-px bg-neutral-800"></div>
          <span className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
            <span className="elsie-black tracking-wider">CraftCV Showcase</span>
          </span>
        </div>
        <button
          onClick={() => navigate('/builder')}
          className="px-5 py-2 rounded-3xl bg-white hover:bg-neutral-200 text-black text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
        >
          <span>Open Builder</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Hero Header */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-8 text-center space-y-3">
        <span className="text-xs uppercase font-bold tracking-widest text-neutral-400 bg-neutral-900 px-3.5 py-1.5 rounded-full border border-neutral-800">
          Curated For Engineering Careers
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight elsie-black">
          Select Your Portfolio Template
        </h1>
        <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto font-serif">
          All designs are powered by MongoDB persistence and include an autonomous Recruiter AI assistant.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="max-w-5xl mx-auto px-6 pb-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        {TEMPLATES.map((tmpl) => {
          const Icon = tmpl.icon;
          return (
            <div
              key={tmpl.id}
              className={`bg-neutral-900/80 border ${tmpl.accentBorder} rounded-3xl p-6 flex flex-col justify-between hover:scale-[1.02] transition-all duration-200 shadow-xl backdrop-blur-md group`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${tmpl.color} flex items-center justify-center text-white shadow-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700">
                    {tmpl.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {tmpl.name}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed mb-6">
                  {tmpl.description}
                </p>

                <div className="space-y-2 mb-8 border-t border-neutral-800/80 pt-4">
                  {tmpl.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-xs text-neutral-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => navigate(`/builder?template=${tmpl.id}`)}
                  className="w-full py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
                >
                  <span>Build with this template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => navigate(`/portfolio/demo?template=${tmpl.id}`)}
                  className="w-full py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-colors cursor-pointer"
                >
                  Live Preview
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Templates;