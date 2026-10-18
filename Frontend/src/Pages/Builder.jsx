import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router';
import { 
  Save, 
  Eye, 
  ExternalLink, 
  Sparkles, 
  Check, 
  Loader2, 
  Layers, 
  Terminal, 
  FileText, 
  User, 
  Code2, 
  Briefcase, 
  GraduationCap, 
  Bot, 
  Plus, 
  Trash2, 
  RotateCcw,
  Share2,
  Copy,
  Palette
} from 'lucide-react';
import { FaGithub as Github } from 'react-icons/fa6';
import { githubApi, portfolioApi } from '../lib/api';
import { DEFAULT_PORTFOLIO, loadDraftPortfolio, saveDraftPortfolio } from '../lib/portfolioStore';
import BentoTemplate from '../components/templates/BentoTemplate';
import TerminalTemplate from '../components/templates/TerminalTemplate';
import ExecutiveTemplate from '../components/templates/ExecutiveTemplate';
import RecruiterChatbot from '../components/portfolio/RecruiterChatbot';

export const Builder = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Load portfolio state
  const [portfolio, setPortfolio] = useState(() => {
    const draft = loadDraftPortfolio();
    const queryTemplate = searchParams.get('template');
    if (queryTemplate) {
      draft.template = queryTemplate;
    }
    return draft;
  });

  const [activeTab, setActiveTab] = useState('import');
  const [githubUser, setGithubUser] = useState(portfolio.personalInfo?.githubUsername || '');
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState(null);

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(null);
  const [savedSlug, setSavedSlug] = useState(portfolio.slug || '');
  const [previewMode, setPreviewMode] = useState(false);

  // Auto-save draft to local storage on edits
  useEffect(() => {
    saveDraftPortfolio(portfolio);
  }, [portfolio]);

  // Handle 1-Click GitHub Ingest
  const handleGithubImport = async (e) => {
    if (e) e.preventDefault();
    if (!githubUser.trim()) return;

    setImporting(true);
    setImportMessage(null);

    try {
      const res = await githubApi.ingest(githubUser.trim());
      if (res.success && res.data) {
        const { personalInfo, skills, projects } = res.data;
        
        setPortfolio(prev => ({
          ...prev,
          slug: personalInfo.githubUsername.toLowerCase(),
          personalInfo: {
            ...prev.personalInfo,
            ...personalInfo
          },
          skills: {
            languages: skills.languages?.length ? skills.languages : prev.skills.languages,
            frameworks: skills.frameworks?.length ? skills.frameworks : prev.skills.frameworks,
            tools: skills.tools?.length ? skills.tools : prev.skills.tools
          },
          projects: projects?.length ? projects : prev.projects
        }));

        setImportMessage({
          type: 'success',
          text: `Successfully ingested GitHub profile! Parsed ${projects?.length || 0} repositories and auto-detected top skills.`
        });
      } else {
        setImportMessage({ type: 'error', text: res.message || 'Could not import GitHub profile.' });
      }
    } catch (err) {
      console.error('GitHub Import Error:', err);
      setImportMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to fetch GitHub profile. Please check the username.'
      });
    } finally {
      setImporting(false);
    }
  };

  // Handle Save to MongoDB
  const handleSaveToDatabase = async () => {
    setSaving(true);
    setSaveSuccess(null);

    try {
      const res = await portfolioApi.save(portfolio);
      if (res.success && res.data) {
        const savedId = res.data.slug || res.data._id;
        setSavedSlug(savedId);
        setSaveSuccess({
          type: 'success',
          id: savedId,
          text: 'Saved successfully to MongoDB database!'
        });
      }
    } catch (err) {
      console.error('Save error:', err);
      setSaveSuccess({
        type: 'error',
        text: err.response?.data?.message || 'Error saving to database. Local draft remains saved!'
      });
    } finally {
      setSaving(false);
    }
  };

  // Handlers for nested state updates
  const updatePersonalInfo = (field, value) => {
    setPortfolio(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const updateSkills = (category, value) => {
    const list = value.split(',').map(s => s.trim()).filter(Boolean);
    setPortfolio(prev => ({
      ...prev,
      skills: { ...prev.skills, [category]: list }
    }));
  };

  const addProject = () => {
    const newProj = {
      title: 'New Engineering Project',
      description: 'Engineered high-performance web application utilizing modern full-stack best practices.',
      repoUrl: '',
      liveDemo: '',
      technologies: ['React', 'Node.js', 'MongoDB'],
      stars: 0,
      pinned: false
    };
    setPortfolio(prev => ({ ...prev, projects: [newProj, ...prev.projects] }));
  };

  const updateProject = (index, field, value) => {
    setPortfolio(prev => {
      const updated = [...prev.projects];
      if (field === 'technologies') {
        updated[index][field] = value.split(',').map(t => t.trim()).filter(Boolean);
      } else {
        updated[index][field] = value;
      }
      return { ...prev, projects: updated };
    });
  };

  const removeProject = (index) => {
    setPortfolio(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const resetToSample = () => {
    if (window.confirm('Reset builder to default full-stack sample portfolio?')) {
      setPortfolio(DEFAULT_PORTFOLIO);
      setSavedSlug('aryan-sharma');
      setImportMessage(null);
      setSaveSuccess(null);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-black text-white font-sans overflow-hidden">
      
      {/* Top Studio Header */}
      <header className="h-16 border-b border-neutral-900 bg-black/90 px-4 sm:px-6 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <Link to="/" className="font-bold text-white tracking-tight flex items-center gap-2 text-sm hover:opacity-80 transition-opacity">
            <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-white to-neutral-400 text-black flex items-center justify-center text-xs font-black">
              C
            </span>
            <span className="elsie-black tracking-wider text-lg">CraftCV Studio</span>
          </Link>
          <span className="hidden sm:inline text-xs text-neutral-600">|</span>
          
          {/* Template Switcher */}
          <div className="hidden sm:flex items-center gap-2 bg-neutral-950 p-1.5 rounded-2xl border border-neutral-800 text-xs">
            <span className="text-[11px] font-semibold text-neutral-400 pl-2 flex items-center gap-1">
              <Palette className="w-3 h-3 text-neutral-400" />
              Template:
            </span>
            <div className="flex items-center gap-1">
              {[
                { id: 'bento', label: 'Bento 3D', icon: Layers },
                { id: 'terminal', label: 'CLI Terminal', icon: Terminal },
                { id: 'executive', label: 'Executive', icon: FileText }
              ].map(t => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setPortfolio(prev => ({ ...prev, template: t.id }))}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-medium transition-all cursor-pointer ${
                      portfolio.template === t.id
                        ? 'bg-white text-black font-semibold shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={resetToSample}
            title="Load sample engineer profile"
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-3xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-medium border border-neutral-800 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Sample Demo</span>
          </button>

          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-3xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium border border-neutral-800 transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{previewMode ? 'Edit Mode' : 'Full Preview'}</span>
          </button>

          <button
            onClick={handleSaveToDatabase}
            disabled={saving}
            className="flex items-center gap-1.5 px-5 py-2 rounded-3xl bg-white hover:bg-neutral-200 text-black text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saving ? 'Saving...' : 'Save to DB'}</span>
          </button>

          {savedSlug && (
            <Link
              to={`/portfolio/${savedSlug}`}
              target="_blank"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-semibold border border-emerald-500/30 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Live URL</span>
            </Link>
          )}
        </div>
      </header>

      {/* Main Studio Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Editor Sidebar (hidden if full preview) */}
        {!previewMode && (
          <aside className="w-full lg:w-[480px] border-r border-neutral-800 bg-neutral-900 flex flex-col shrink-0">
            {/* Sidebar Navigation Tabs */}
            <div className="flex border-b border-neutral-800 bg-neutral-950 text-xs overflow-x-auto no-scrollbar">
              {[
                { id: 'templates', label: 'Templates', icon: Palette },
                { id: 'import', label: '1-Click GitHub', icon: Github },
                { id: 'profile', label: 'Basics', icon: User },
                { id: 'skills', label: 'Skills', icon: Code2 },
                { id: 'projects', label: 'Projects', icon: Layers },
                { id: 'experience', label: 'Experience', icon: Briefcase },
                { id: 'ai', label: 'Recruiter AI', icon: Bot },
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-3 font-medium whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? 'border-white text-white bg-neutral-900 font-semibold'
                        : 'border-transparent text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Editor Tab Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">

              {/* TAB: Select Templates */}
              {activeTab === 'templates' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                    <span className="text-xs uppercase font-bold text-neutral-400 tracking-wider">Choose Theme</span>
                    <h3 className="text-sm font-bold text-white">Select Your Portfolio Template</h3>
                    <p className="text-xs text-neutral-400">
                      Click any design to immediately switch the live preview on the right.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        id: 'bento',
                        title: 'Modern Bento 3D Grid',
                        desc: 'Sleek dark-mode Bento boxes with ambient glowing backdrops, project badges, and verified links.',
                        badge: 'Recommended',
                        icon: Layers,
                        accent: 'from-blue-600 to-indigo-600'
                      },
                      {
                        id: 'terminal',
                        title: 'Hacker CLI Terminal',
                        desc: 'Interactive terminal emulator where recruiters can execute bash commands (help, bio, skills, projects).',
                        badge: 'Interactive',
                        icon: Terminal,
                        accent: 'from-emerald-600 to-teal-600'
                      },
                      {
                        id: 'executive',
                        title: 'Executive Minimalist',
                        desc: 'Clean, publication-grade resume and portfolio layout designed for ATS scanning and direct PDF printing.',
                        badge: 'ATS Ready',
                        icon: FileText,
                        accent: 'from-purple-600 to-pink-600'
                      }
                    ].map(tmpl => {
                      const Icon = tmpl.icon;
                      const isSelected = portfolio.template === tmpl.id;
                      return (
                        <div
                          key={tmpl.id}
                          onClick={() => setPortfolio(prev => ({ ...prev, template: tmpl.id }))}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                            isSelected
                              ? 'bg-neutral-900 border-white shadow-xl shadow-white/5 ring-1 ring-white/20'
                              : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/60'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${tmpl.accent} flex items-center justify-center text-white shadow-md`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                  {tmpl.title}
                                </h4>
                                <span className="text-[10px] font-semibold text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded-full border border-neutral-700">
                                  {tmpl.badge}
                                </span>
                              </div>
                            </div>

                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-white bg-white text-black' : 'border-neutral-700'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </div>

                          <p className="text-xs text-neutral-400 leading-relaxed pl-12">
                            {tmpl.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* TAB 1: 1-Click GitHub Import */}
              {activeTab === 'import' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-tr from-blue-950/40 to-indigo-950/40 border border-blue-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      Zero-Typing GitHub Ingestion
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      Enter any public GitHub handle. CraftCV automatically queries the GitHub API, computes your primary tech stack from repositories, extracts stars & descriptions, and builds your portfolio.
                    </p>
                  </div>

                  <form onSubmit={handleGithubImport} className="space-y-3">
                    <label className="text-xs font-semibold text-neutral-300 block">
                      GitHub Username
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Github className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={githubUser}
                          onChange={(e) => setGithubUser(e.target.value)}
                          placeholder="e.g. facebook, shadcn, or your username"
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={importing || !githubUser.trim()}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0"
                      >
                        {importing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                        <span>{importing ? 'Ingesting...' : 'Import'}</span>
                      </button>
                    </div>
                  </form>

                  {importMessage && (
                    <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                      importMessage.type === 'success' 
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                        : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                    }`}>
                      {importMessage.type === 'success' ? <Check className="w-4 h-4 shrink-0 mt-0.5" /> : null}
                      <span>{importMessage.text}</span>
                    </div>
                  )}

                  {saveSuccess && (
                    <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-300 flex items-center justify-between">
                      <span>{saveSuccess.text}</span>
                      <Link
                        to={`/portfolio/${saveSuccess.id}`}
                        target="_blank"
                        className="font-bold underline text-white hover:text-blue-200"
                      >
                        Open Live
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: Personal Profile */}
              {activeTab === 'profile' && (
                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="text-neutral-400 font-medium block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={portfolio.personalInfo?.fullName || ''}
                      onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 font-medium block mb-1">Professional Title</label>
                    <input
                      type="text"
                      value={portfolio.personalInfo?.title || ''}
                      onChange={(e) => updatePersonalInfo('title', e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 font-medium block mb-1">Bio / Summary</label>
                    <textarea
                      rows={3}
                      value={portfolio.personalInfo?.bio || ''}
                      onChange={(e) => updatePersonalInfo('bio', e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-neutral-400 font-medium block mb-1">Email</label>
                      <input
                        type="email"
                        value={portfolio.personalInfo?.email || ''}
                        onChange={(e) => updatePersonalInfo('email', e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-neutral-400 font-medium block mb-1">Location</label>
                      <input
                        type="text"
                        value={portfolio.personalInfo?.location || ''}
                        onChange={(e) => updatePersonalInfo('location', e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-neutral-400 font-medium block mb-1">Avatar Image URL</label>
                    <input
                      type="text"
                      value={portfolio.personalInfo?.avatarUrl || ''}
                      onChange={(e) => updatePersonalInfo('avatarUrl', e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="text-neutral-400 font-medium block mb-1">GitHub Username</label>
                      <input
                        type="text"
                        value={portfolio.personalInfo?.githubUsername || ''}
                        onChange={(e) => updatePersonalInfo('githubUsername', e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-neutral-400 font-medium block mb-1">LinkedIn URL</label>
                      <input
                        type="text"
                        value={portfolio.personalInfo?.linkedinUrl || ''}
                        onChange={(e) => updatePersonalInfo('linkedinUrl', e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Skills */}
              {activeTab === 'skills' && (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="text-neutral-300 font-semibold block mb-1">
                      Programming Languages (comma separated)
                    </label>
                    <input
                      type="text"
                      value={(portfolio.skills?.languages || []).join(', ')}
                      onChange={(e) => updateSkills('languages', e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-300 font-semibold block mb-1">
                      Frameworks & Libraries (comma separated)
                    </label>
                    <input
                      type="text"
                      value={(portfolio.skills?.frameworks || []).join(', ')}
                      onChange={(e) => updateSkills('frameworks', e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-300 font-semibold block mb-1">
                      Tools, Databases & Cloud (comma separated)
                    </label>
                    <input
                      type="text"
                      value={(portfolio.skills?.tools || []).join(', ')}
                      onChange={(e) => updateSkills('tools', e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: Projects */}
              {activeTab === 'projects' && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-neutral-300">
                      Projects ({portfolio.projects?.length || 0})
                    </span>
                    <button
                      onClick={addProject}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Project
                    </button>
                  </div>

                  {(portfolio.projects || []).map((proj, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2.5 relative group">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => updateProject(idx, 'title', e.target.value)}
                          className="bg-transparent font-bold text-white text-xs focus:outline-none border-b border-transparent focus:border-blue-500 w-3/4"
                        />
                        <button
                          onClick={() => removeProject(idx)}
                          className="text-neutral-500 hover:text-rose-400 p-1 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <textarea
                        rows={2}
                        value={proj.description}
                        onChange={(e) => updateProject(idx, 'description', e.target.value)}
                        placeholder="Project description..."
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-neutral-300 focus:outline-none focus:border-blue-500 text-[11px]"
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={proj.repoUrl || ''}
                          onChange={(e) => updateProject(idx, 'repoUrl', e.target.value)}
                          placeholder="Repository URL"
                          className="bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-neutral-300 focus:outline-none text-[11px]"
                        />
                        <input
                          type="text"
                          value={proj.liveDemo || ''}
                          onChange={(e) => updateProject(idx, 'liveDemo', e.target.value)}
                          placeholder="Live Demo URL"
                          className="bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-neutral-300 focus:outline-none text-[11px]"
                        />
                      </div>

                      <input
                        type="text"
                        value={(proj.technologies || []).join(', ')}
                        onChange={(e) => updateProject(idx, 'technologies', e.target.value)}
                        placeholder="Tech stack (e.g. React, Node, Redis)"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-neutral-300 focus:outline-none text-[11px]"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 5: Experience & Education */}
              {activeTab === 'experience' && (
                <div className="space-y-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                    <span className="font-semibold text-neutral-300 block">Work Experience</span>
                    <input
                      type="text"
                      value={portfolio.experience?.[0]?.role || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPortfolio(prev => {
                          const updated = [...(prev.experience || [{ company: '', role: '' }])];
                          updated[0].role = val;
                          return { ...prev, experience: updated };
                        });
                      }}
                      placeholder="Role (e.g. Software Engineer Intern)"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-white"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={portfolio.experience?.[0]?.company || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPortfolio(prev => {
                            const updated = [...(prev.experience || [{ company: '', role: '' }])];
                            updated[0].company = val;
                            return { ...prev, experience: updated };
                          });
                        }}
                        placeholder="Company"
                        className="bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-white"
                      />
                      <input
                        type="text"
                        value={portfolio.experience?.[0]?.duration || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPortfolio(prev => {
                            const updated = [...(prev.experience || [{ company: '', role: '' }])];
                            updated[0].duration = val;
                            return { ...prev, experience: updated };
                          });
                        }}
                        placeholder="Duration (e.g. May 2025 - Present)"
                        className="bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-white"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={portfolio.experience?.[0]?.description || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPortfolio(prev => {
                          const updated = [...(prev.experience || [{ company: '', role: '' }])];
                          updated[0].description = val;
                          return { ...prev, experience: updated };
                        });
                      }}
                      placeholder="Summary of responsibilities..."
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-white"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                    <span className="font-semibold text-neutral-300 block">Education</span>
                    <input
                      type="text"
                      value={portfolio.education?.[0]?.degree || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPortfolio(prev => {
                          const updated = [...(prev.education || [{ degree: '', institution: '' }])];
                          updated[0].degree = val;
                          return { ...prev, education: updated };
                        });
                      }}
                      placeholder="Degree (e.g. B.Tech Computer Science)"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-white"
                    />
                    <input
                      type="text"
                      value={portfolio.education?.[0]?.institution || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPortfolio(prev => {
                          const updated = [...(prev.education || [{ degree: '', institution: '' }])];
                          updated[0].institution = val;
                          return { ...prev, education: updated };
                        });
                      }}
                      placeholder="University / Institute"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-white"
                    />
                  </div>
                </div>
              )}

              {/* TAB 6: AI Recruiter Assistant */}
              {activeTab === 'ai' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 to-blue-950/40 border border-purple-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-purple-400 font-bold">
                      <Bot className="w-4 h-4" />
                      Candidate AI "Digital Twin"
                    </div>
                    <p className="text-neutral-300 leading-relaxed text-[11px]">
                      When visitors view your portfolio, they can converse with this autonomous recruiter agent. It automatically draws facts from your GitHub projects and skills.
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                    <div>
                      <span className="font-semibold text-neutral-200 block">Enable Recruiter AI</span>
                      <span className="text-[11px] text-neutral-400">Renders floating chat bubble on your live portfolio</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={portfolio.aiSettings?.enabled ?? true}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setPortfolio(prev => ({
                          ...prev,
                          aiSettings: { ...prev.aiSettings, enabled: val }
                        }));
                      }}
                      className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 font-medium block mb-1">Custom Recruiter Welcome Message</label>
                    <textarea
                      rows={3}
                      value={portfolio.aiSettings?.welcomeMessage || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPortfolio(prev => ({
                          ...prev,
                          aiSettings: { ...prev.aiSettings, welcomeMessage: val }
                        }));
                      }}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

            </div>
          </aside>
        )}

        {/* Right Side: Live Synchronized Preview */}
        <main className="flex-1 bg-neutral-950 overflow-y-auto relative">
          <div className="w-full h-full">
            {portfolio.template === 'terminal' ? (
              <TerminalTemplate portfolio={portfolio} />
            ) : portfolio.template === 'executive' ? (
              <ExecutiveTemplate portfolio={portfolio} />
            ) : (
              <BentoTemplate portfolio={portfolio} />
            )}
          </div>

          {/* Embedded Recruiter Chatbot Preview */}
          <RecruiterChatbot portfolio={portfolio} />
        </main>

      </div>
    </div>
  );
};

export default Builder;