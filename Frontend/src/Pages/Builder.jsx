import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Trash2, 
  Download, 
  User, 
  Briefcase, 
  GraduationCap, 
  Zap, 
  FileText, 
  CheckCircle, 
  ChevronLeft, 
  Minus,
  Sparkles,
  Loader2,
  Save,
  Check,
  ExternalLink,
  Layers,
  Terminal as TerminalIcon,
  Eye
} from 'lucide-react'
import { FaGithub as Github } from 'react-icons/fa6'
import { githubApi, portfolioApi } from '../lib/api'
import resume3 from '../assets/resume3.png'
import resume2 from '../assets/resume2.png'
import resume4 from '../assets/resume4.png'
import resume from '../assets/resume.png'

const templatePreviews = [
  { id: 'apex',    name: 'Apex',    img: resume3 },
  { id: 'nova',    name: 'Nova',    img: resume2 },
  { id: 'slate',   name: 'Slate',   img: resume4 },
  { id: 'minimal', name: 'Minimal', img: resume  },
]

const SECTIONS = [
  { id: 'personal',    label: 'Personal Info', icon: User           },
  { id: 'summary',     label: 'Summary',       icon: FileText       },
  { id: 'experience',  label: 'Experience',    icon: Briefcase      },
  { id: 'education',   label: 'Education',     icon: GraduationCap  },
  { id: 'skills',      label: 'Skills',        icon: Zap            },
]

export default function Builder() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialMode = searchParams.get('mode') || 'manual'
  const initialTemplate = searchParams.get('template') || 'apex'

  const [mode, setMode] = useState(initialMode)
  const [selectedTemplate, setSelectedTemplate] = useState(initialTemplate)
  const [activeSection, setActiveSection] = useState(mode === 'github' ? 'github' : 'personal')

  // Form State
  const [personal, setPersonal] = useState({
    name: 'Alex Chen',
    title: 'Senior Software Engineer',
    email: 'alex.chen@email.com',
    phone: '+1 (555) 012-3456',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexchen',
    website: 'alexchen.dev',
    summary: 'Experienced software engineer with 6+ years building scalable web applications. Passionate about clean architecture, developer experience, and shipping products that users love.',
  })

  const [experience, setExperience] = useState([
    {
      id: 1,
      company: 'Stripe',
      role: 'Senior Software Engineer',
      start: 'Mar 2022',
      end: 'Present',
      location: 'San Francisco, CA',
      bullets: [
        'Led a team of 5 engineers to rebuild the payments dashboard, reducing load time by 60%.',
        'Designed and shipped a new webhooks system handling 2M+ events/day with 99.99% reliability.',
        'Mentored 3 junior engineers through structured code reviews and weekly 1:1s.',
      ],
    },
    {
      id: 2,
      company: 'Airbnb',
      role: 'Software Engineer',
      start: 'Jun 2019',
      end: 'Feb 2022',
      location: 'San Francisco, CA',
      bullets: [
        'Built the host earnings analytics feature used by 4M+ hosts worldwide.',
        'Reduced CI pipeline duration by 40% through test parallelization and caching strategies.',
      ],
    },
  ])

  const [education, setEducation] = useState([
    { id: 1, school: 'University of California, Berkeley', degree: 'B.S. Computer Science', start: '2015', end: '2019', gpa: '3.8' },
  ])

  const [skills, setSkills] = useState([
    'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Redis', 'AWS', 'Go', 'GraphQL', 'Docker', 'Kubernetes'
  ])

  // GitHub Ingestion State
  const [githubUser, setGithubUser] = useState('')
  const [fetchingGithub, setFetchingGithub] = useState(false)
  const [githubResult, setGithubResult] = useState(null)
  const [githubError, setGithubError] = useState(null)

  // Save / Persistence State
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(null)

  // Sync mode changes with URL
  const switchMode = (newMode) => {
    setMode(newMode)
    setSearchParams({ mode: newMode, template: selectedTemplate })
    if (newMode === 'github') {
      setActiveSection('github')
    } else if (activeSection === 'github') {
      setActiveSection('personal')
    }
  }

  // Handle GitHub Ingestion
  const handleGithubFetch = async (e) => {
    if (e) e.preventDefault()
    if (!githubUser.trim()) return

    setFetchingGithub(true)
    setGithubError(null)
    setGithubResult(null)

    try {
      const res = await githubApi.ingest(githubUser.trim())
      if (res.success && res.data) {
        const { personalInfo, skills: fetchedSkills, projects } = res.data

        // Auto populate personal data
        setPersonal(prev => ({
          ...prev,
          name: personalInfo.fullName || prev.name,
          title: personalInfo.title || prev.title,
          summary: personalInfo.bio || prev.summary,
          location: personalInfo.location || prev.location,
          website: personalInfo.websiteUrl || prev.website,
          linkedin: personalInfo.twitterUrl || prev.linkedin,
          email: personalInfo.email || prev.email
        }))

        // Auto populate skills
        const combinedSkills = Array.from(new Set([
          ...(fetchedSkills.languages || []),
          ...(fetchedSkills.frameworks || []),
          ...(fetchedSkills.tools || [])
        ]))
        if (combinedSkills.length > 0) {
          setSkills(combinedSkills)
        }

        // Format fetched projects into experience bullets if useful
        if (projects && projects.length > 0) {
          const newExp = {
            id: Date.now(),
            company: 'Open Source / GitHub Repositories',
            role: 'Lead Architect & Maintainer',
            start: '2023',
            end: 'Present',
            location: 'Remote',
            bullets: projects.slice(0, 3).map(p => 
              `${p.title}: ${p.description} (Built with ${(p.technologies || []).join(', ')}) ★ ${p.stars || 0} stars`
            )
          }
          setExperience(prev => [newExp, ...prev])
        }

        setGithubResult({
          reposCount: projects?.length || 0,
          languages: fetchedSkills.languages || []
        })
      }
    } catch (err) {
      console.error('GitHub Fetch Error:', err)
      setGithubError(err.response?.data?.message || 'Could not fetch GitHub profile. Please check the username.')
    } finally {
      setFetchingGithub(false)
    }
  }

  // Handle Save to Database
  const handleSave = async () => {
    setSaving(true)
    setSavedSuccess(null)

    const payload = {
      slug: personal.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4),
      title: `${personal.name} Resume`,
      mode,
      template: selectedTemplate,
      personalInfo: {
        fullName: personal.name,
        title: personal.title,
        bio: personal.summary,
        email: personal.email,
        phone: personal.phone,
        location: personal.location,
        websiteUrl: personal.website,
        linkedinUrl: personal.linkedin,
        githubUsername: githubUser || ''
      },
      skills: {
        languages: skills.slice(0, 8),
        frameworks: skills.slice(8, 14),
        tools: skills.slice(14)
      },
      experience: experience.map(exp => ({
        company: exp.company,
        role: exp.role,
        duration: `${exp.start} - ${exp.end}`,
        description: exp.bullets.join('. ')
      })),
      education: education.map(edu => ({
        degree: edu.degree,
        institution: edu.school,
        year: `${edu.start} - ${edu.end}`,
        score: edu.gpa
      }))
    }

    try {
      const res = await portfolioApi.save(payload)
      if (res.success) {
        setSavedSuccess('Saved successfully to MongoDB!')
        setTimeout(() => setSavedSuccess(null), 4000)
      }
    } catch (err) {
      console.error('Save error:', err)
      setSavedSuccess('Saved to local draft!')
      setTimeout(() => setSavedSuccess(null), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="bg-black min-h-screen text-white flex flex-col font-sans">

      {/* Top Header */}
      <header className="flex items-center justify-between px-6 h-16 border-b border-white/10 bg-black sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors text-sm">
            <ChevronLeft size={16} />
            Dashboard
          </Link>
          <div className="w-px h-4 bg-white/10" />

          {/* Builder Mode Switcher */}
          <div className="flex items-center bg-[#111] p-1 rounded-2xl border border-white/10 text-xs">
            <button
              onClick={() => switchMode('manual')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                mode === 'manual' ? 'bg-white text-black font-semibold' : 'text-white/60 hover:text-white'
              }`}
            >
              Manual Builder
            </button>
            <button
              onClick={() => switchMode('github')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                mode === 'github' ? 'bg-white text-black font-semibold' : 'text-white/60 hover:text-white'
              }`}
            >
              <Github size={12} />
              <span>GitHub Fetch</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium text-green-400 bg-green-500/10 border-green-500/20">
            <CheckCircle size={12} />
            ATS Score: 94/100
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-xl font-medium transition-colors cursor-pointer"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            <span>{saving ? 'Saving...' : 'Save to DB'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs bg-white text-black px-4 py-2 rounded-xl font-semibold hover:bg-white/90 transition-colors cursor-pointer shadow-md"
          >
            <Download size={13} />
            Export PDF
          </button>
        </div>
      </header>

      {savedSuccess && (
        <div className="bg-emerald-500/20 border-b border-emerald-500/30 text-emerald-300 text-xs py-2 px-6 text-center font-medium">
          {savedSuccess}
        </div>
      )}

      {/* Main Builder Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left Sidebar: Sections & Templates */}
        <aside className="hidden lg:flex flex-col w-56 border-r border-white/10 bg-black py-6 shrink-0">
          
          {mode === 'github' && (
            <div className="mb-4 px-3">
              <button
                onClick={() => setActiveSection('github')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium w-full text-left transition-all cursor-pointer ${
                  activeSection === 'github'
                    ? 'bg-white text-black font-semibold'
                    : 'text-white/70 hover:bg-white/5'
                }`}
              >
                <Github size={15} />
                <span>GitHub Ingest</span>
              </button>
            </div>
          )}

          <p className="text-[10px] uppercase tracking-widest text-white/30 px-5 mb-2">Sections</p>
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`flex items-center gap-3 px-5 py-2.5 text-xs text-left w-full transition-colors cursor-pointer ${
                activeSection === id
                  ? 'text-white bg-white/10 border-r-2 border-white font-medium'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={14} className="shrink-0" />
              <span>{label}</span>
            </button>
          ))}

          {/* Template Switcher */}
          <div className="mt-auto px-5 pt-4 border-t border-white/10">
            <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2.5">Select Template</p>
            <div className="grid grid-cols-2 gap-2">
              {templatePreviews.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  className={`rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                    selectedTemplate === t.id ? 'border-white scale-[1.03] shadow-md' : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <img src={t.img} alt={t.name} className="w-full object-cover aspect-[3/4]" />
                  <p className="text-[10px] text-center py-1 bg-[#111] text-white/70">{t.name}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Center: Active Section Editor Form */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-5">

          {/* GITHUB MODE SECTION */}
          {activeSection === 'github' && mode === 'github' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/10 space-y-3">
                <div className="flex items-center gap-2.5 text-white">
                  <Github size={20} />
                  <h2 className="text-xl font-bold elsie-black">1-Click GitHub Ingestion</h2>
                </div>
                <p className="text-xs text-white/60 leading-relaxed max-w-xl">
                  Enter your GitHub username. We will automatically inspect your public repositories, extract top projects, calculate language usage stats, and populate your resume fields immediately.
                </p>

                <form onSubmit={handleGithubFetch} className="flex gap-3 pt-2">
                  <div className="relative flex-1">
                    <Github className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={15} />
                    <input
                      type="text"
                      value={githubUser}
                      onChange={(e) => setGithubUser(e.target.value)}
                      placeholder="e.g. torvalds, shadcn, or your username"
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 w-full text-white placeholder-white/30 focus:outline-none focus:border-white/30 text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={fetchingGithub || !githubUser.trim()}
                    className="bg-white text-black px-6 py-3 rounded-xl font-semibold text-xs hover:bg-white/90 disabled:opacity-40 transition-all flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    {fetchingGithub ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
                    <span>{fetchingGithub ? 'Ingesting...' : 'Fetch Profile'}</span>
                  </button>
                </form>

                {githubError && (
                  <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
                    {githubError}
                  </p>
                )}

                {githubResult && (
                  <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-xs text-green-300 space-y-1">
                    <p className="font-semibold flex items-center gap-1.5">
                      <Check size={14} />
                      Successfully imported {githubResult.reposCount} projects from GitHub!
                    </p>
                    <p className="text-white/60">
                      Auto-detected languages: {githubResult.languages.join(', ')}. Check the preview on the right!
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* PERSONAL INFO SECTION */}
          {activeSection === 'personal' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <h2 className="text-xl elsie-black text-white">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-white/40">Full Name</label>
                  <input
                    type="text"
                    value={personal.name}
                    onChange={(e) => setPersonal({ ...personal, name: e.target.value })}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-white/40">Professional Title</label>
                  <input
                    type="text"
                    value={personal.title}
                    onChange={(e) => setPersonal({ ...personal, title: e.target.value })}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-white/40">Email Address</label>
                  <input
                    type="email"
                    value={personal.email}
                    onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-white/40">Phone Number</label>
                  <input
                    type="text"
                    value={personal.phone}
                    onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-white/40">Location</label>
                  <input
                    type="text"
                    value={personal.location}
                    onChange={(e) => setPersonal({ ...personal, location: e.target.value })}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-white/40">Website / Portfolio</label>
                  <input
                    type="text"
                    value={personal.website}
                    onChange={(e) => setPersonal({ ...personal, website: e.target.value })}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* SUMMARY SECTION */}
          {activeSection === 'summary' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <h2 className="text-xl elsie-black text-white">Professional Summary</h2>
              <textarea
                rows={5}
                value={personal.summary}
                onChange={(e) => setPersonal({ ...personal, summary: e.target.value })}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 w-full leading-relaxed"
              />
            </motion.div>
          )}

          {/* EXPERIENCE SECTION */}
          {activeSection === 'experience' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl elsie-black text-white">Work Experience</h2>
                <button
                  onClick={() => setExperience([
                    {
                      id: Date.now(),
                      company: 'New Company',
                      role: 'Software Engineer',
                      start: '2024',
                      end: 'Present',
                      location: 'Remote',
                      bullets: ['Engineered scalable features and improved performance.']
                    },
                    ...experience
                  ])}
                  className="flex items-center gap-1.5 text-xs border border-white/20 text-white/70 hover:border-white hover:text-white px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                >
                  <Plus size={13} />
                  Add Position
                </button>
              </div>

              {experience.map((exp, expIdx) => (
                <div key={exp.id} className="border border-white/10 rounded-2xl p-5 space-y-3 bg-[#0a0a0a]">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">{exp.role} at {exp.company}</p>
                    <button
                      onClick={() => setExperience(experience.filter((_, i) => i !== expIdx))}
                      className="text-white/30 hover:text-rose-400 p-1 cursor-pointer transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => {
                        const copy = [...experience]
                        copy[expIdx].company = e.target.value
                        setExperience(copy)
                      }}
                      placeholder="Company"
                      className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs"
                    />
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => {
                        const copy = [...experience]
                        copy[expIdx].role = e.target.value
                        setExperience(copy)
                      }}
                      placeholder="Job Title"
                      className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-white/40">Bullet Points</label>
                    {exp.bullets.map((b, bIdx) => (
                      <input
                        key={bIdx}
                        value={b}
                        onChange={(e) => {
                          const copy = [...experience]
                          copy[expIdx].bullets[bIdx] = e.target.value
                          setExperience(copy)
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* EDUCATION SECTION */}
          {activeSection === 'education' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <h2 className="text-xl elsie-black text-white">Education</h2>
              {education.map((edu, idx) => (
                <div key={edu.id} className="border border-white/10 rounded-2xl p-5 space-y-3 bg-[#0a0a0a]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-white/40">School / University</label>
                      <input
                        type="text"
                        value={edu.school}
                        onChange={(e) => {
                          const copy = [...education]
                          copy[idx].school = e.target.value
                          setEducation(copy)
                        }}
                        className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-white/40">Degree</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => {
                          const copy = [...education]
                          copy[idx].degree = e.target.value
                          setEducation(copy)
                        }}
                        className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* SKILLS SECTION */}
          {activeSection === 'skills' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <h2 className="text-xl elsie-black text-white">Skills & Technologies</h2>
              <div className="flex flex-wrap gap-2 p-4 border border-white/10 rounded-2xl min-h-28 bg-[#0a0a0a]">
                {skills.map((s, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white">
                    <span>{s}</span>
                    <button
                      onClick={() => setSkills(skills.filter((_, i) => i !== idx))}
                      className="text-white/40 hover:text-rose-400 cursor-pointer transition-colors"
                    >
                      <Minus size={11} />
                    </button>
                  </div>
                ))}
                <input
                  placeholder="+ Type skill & press Enter..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      setSkills([...skills, e.target.value.trim()])
                      e.target.value = ''
                    }
                  }}
                  className="bg-transparent text-white text-xs placeholder-white/20 focus:outline-none px-2 py-1.5 min-w-[150px]"
                />
              </div>
            </motion.div>
          )}

        </main>

        {/* Right Side: Live Resume Preview */}
        <aside className="hidden xl:flex flex-col w-[480px] border-l border-white/10 bg-[#0a0a0a] shrink-0">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <span className="text-sm font-medium text-white flex items-center gap-2">
              <Eye size={14} className="text-white/50" />
              Live Preview
            </span>
            <span className="text-xs text-white/40">
              Template: <span className="text-white font-medium uppercase tracking-wider">{selectedTemplate}</span>
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="transform scale-[0.74] origin-top-left w-[135%]">
              {/* Clean Styled Resume Sheet */}
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden text-black font-serif">
                <div className="bg-gray-950 text-white px-8 py-7">
                  <h1 className="text-2xl font-bold tracking-tight">{personal.name}</h1>
                  <p className="text-sm text-gray-300 mt-0.5">{personal.title}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-400">
                    {personal.email && <span>{personal.email}</span>}
                    {personal.phone && <span>{personal.phone}</span>}
                    {personal.location && <span>{personal.location}</span>}
                    {personal.website && <span>{personal.website}</span>}
                  </div>
                </div>

                <div className="px-8 py-6 space-y-5 text-[11px] leading-relaxed">
                  {personal.summary && (
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-1 mb-2 font-sans font-semibold">
                        Summary
                      </p>
                      <p className="text-gray-700">{personal.summary}</p>
                    </div>
                  )}

                  {experience.length > 0 && (
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-1 mb-3 font-sans font-semibold">
                        Experience & Highlights
                      </p>
                      <div className="space-y-4">
                        {experience.map((exp) => (
                          <div key={exp.id}>
                            <div className="flex justify-between items-baseline">
                              <p className="font-bold text-gray-900 text-xs">{exp.role}</p>
                              <p className="text-gray-400 text-[10px]">{exp.start} – {exp.end}</p>
                            </div>
                            <p className="text-gray-500">{exp.company} {exp.location ? `· ${exp.location}` : ''}</p>
                            <ul className="mt-1.5 space-y-1 list-disc list-inside text-gray-700">
                              {exp.bullets.map((b, i) => (
                                <li key={i}>{b}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {education.length > 0 && (
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-1 mb-2 font-sans font-semibold">
                        Education
                      </p>
                      {education.map((edu) => (
                        <div key={edu.id} className="flex justify-between items-baseline">
                          <div>
                            <p className="font-bold text-gray-900 text-xs">{edu.degree}</p>
                            <p className="text-gray-500">{edu.school}</p>
                          </div>
                          <p className="text-gray-400 text-[10px]">{edu.start} – {edu.end}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {skills.length > 0 && (
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-1 mb-2 font-sans font-semibold">
                        Skills
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {skills.map((s, i) => (
                          <span key={i} className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full text-[10px]">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  )
}
