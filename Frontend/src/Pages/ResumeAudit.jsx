import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LuUpload as Upload, 
  LuFileText as FileText, 
  LuSparkles as Sparkles, 
  LuCircleCheck as CheckCircle, 
  LuCircleAlert as AlertCircle, 
  LuLoaderCircle as Loader2, 
  LuArrowRight as ArrowRight, 
  LuRotateCcw as RotateCcw, 
  LuFlame as Flame, 
  LuShieldAlert as ShieldAlert,
  LuCheck as Check,
  LuChevronLeft as ChevronLeft,
  LuGraduationCap as GraduationCap,
  LuWandSparkles as Wand2
} from 'react-icons/lu'
import Navbar from '@/components/Navbar'
import { resumeApi } from '../lib/api'

export default function ResumeAudit() {
  const [file, setFile] = useState(null)
  const [pasteText, setPasteText] = useState('')
  const [activeTab, setActiveTab] = useState('upload') // 'upload' | 'paste'
  const [loading, setLoading] = useState(false)
  const [stepText, setStepText] = useState('')
  const [auditResult, setAuditResult] = useState(null)
  const [error, setError] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
      setError(null)
    }
  }

  const handleAnalyze = async () => {
    if (activeTab === 'upload' && !file) {
      setError('Please select a PDF resume file to audit.')
      return
    }
    if (activeTab === 'paste' && !pasteText.trim()) {
      setError('Please paste your resume text to audit.')
      return
    }

    setLoading(true)
    setError(null)
    setAuditResult(null)
    setStepText('Extracting resume content & formatting...')

    const t1 = setTimeout(() => {
      setStepText('Gemini 2.5 analyzing ATS keywords & action verbs...')
    }, 1200)
    const t2 = setTimeout(() => {
      setStepText('Generating line-by-line rewrites & score breakdown...')
    }, 2400)

    try {
      let res
      if (activeTab === 'upload' && file) {
        res = await resumeApi.auditFile(file)
      } else {
        res = await resumeApi.auditText(pasteText.trim())
      }

      if (res.success && res.data) {
        setAuditResult(res.data)
        // Store parsed resume in localStorage for 1-click import into builder or interview prep
        if (res.data.parsedResume) {
          localStorage.setItem('craftcv_current_resume', JSON.stringify(res.data.parsedResume))
        }
      }
    } catch (err) {
      console.error('Audit Error:', err)
      setError(err.message || 'Failed to audit resume. Please try again.')
    } finally {
      clearTimeout(t1)
      clearTimeout(t2)
      setLoading(false)
    }
  }

  const handleUseSampleResume = () => {
    const sample = `Alex Chen
Senior Software Engineer | alex.chen@email.com | San Francisco, CA

SUMMARY
Software engineer with 5+ years building web applications. Passionate about clean architecture and backend systems.

EXPERIENCE
Software Engineer - Acme Corp (2022 - Present)
- Worked on customer payments dashboard and fixed database issues.
- Built backend API endpoints using Node.js and Express.
- Collaborated with product managers to deliver sprint features.

Junior Developer - Beta Labs (2020 - 2022)
- Maintained web portal and wrote unit tests for services.
- Created reusable components using React and CSS.

EDUCATION
B.S. in Computer Science - UC Berkeley (2016 - 2020)

SKILLS
JavaScript, React, Node.js, Express, HTML, CSS, SQL, Git`

    setActiveTab('paste')
    setPasteText(sample)
    setError(null)
  }

  const handleImportToBuilder = () => {
    navigate('/builder?mode=manual')
  }

  const handleGoToViva = () => {
    navigate('/interview')
  }

  const handleReset = () => {
    setAuditResult(null)
    setFile(null)
    setPasteText('')
    setError(null)
  }

  return (
    <div className="bg-black min-h-screen text-white flex flex-col font-sans">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 md:px-8 py-10 flex-1 w-full space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="space-y-1">
            <Link to="/dashboard" className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors mb-2">
              <ChevronLeft size={14} />
              Back to Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl elsie-black text-white">AI Resume Auditor &amp; ATS Scanner</h1>
              <span className="text-xs px-2.5 py-1 rounded-full border border-purple-500/40 bg-purple-500/10 text-purple-300 font-mono">
                Standalone Studio
              </span>
            </div>
            <p className="text-xs sm:text-sm text-white/60 max-w-2xl">
              Upload your current resume in PDF format or paste its text. Our standalone AI engine diagnoses your ATS score, flags fatal recruiter rejections, and produces actionable line-by-line rewrites.
            </p>
          </div>

          {auditResult && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-medium text-white transition-colors cursor-pointer self-start sm:self-auto"
            >
              <RotateCcw size={13} />
              <span>Audit Another Resume</span>
            </button>
          )}
        </div>

        {/* UPLOAD & INPUT SECTION (Shown when no audit result is loaded) */}
        {!auditResult && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            {/* Input Mode Selector */}
            <div className="flex items-center gap-3">
              <div className="flex bg-[#111] p-1 rounded-2xl border border-white/10 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'upload' ? 'bg-white text-black font-semibold' : 'text-white/60 hover:text-white'
                  }`}
                >
                  📄 Upload PDF File
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('paste')}
                  className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'paste' ? 'bg-white text-black font-semibold' : 'text-white/60 hover:text-white'
                  }`}
                >
                  📝 Paste Resume Text
                </button>
              </div>

              <button
                type="button"
                onClick={handleUseSampleResume}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs text-purple-300 hover:text-purple-200 ml-auto cursor-pointer"
              >
                <Sparkles size={13} />
                <span>Try Sample Resume</span>
              </button>
            </div>

            {/* Upload Dropzone */}
            {activeTab === 'upload' && (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-12 md:p-16 rounded-3xl border-2 border-dashed text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-4 ${
                  isDragging 
                    ? 'border-purple-400 bg-purple-950/20 scale-[1.01]' 
                    : file 
                      ? 'border-emerald-500/50 bg-emerald-950/10' 
                      : 'border-white/15 bg-[#0a0a0a] hover:border-white/30 hover:bg-[#0f0f0f]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 shadow-inner">
                  {file ? <FileText size={28} className="text-emerald-400" /> : <Upload size={28} />}
                </div>

                <div className="space-y-1">
                  <p className="text-base font-bold text-white elsie-black">
                    {file ? file.name : 'Drag & drop your PDF resume here, or click to browse'}
                  </p>
                  <p className="text-xs text-white/40">
                    {file ? `${(file.size / 1024).toFixed(1)} KB · Ready to audit` : 'Supports standard PDF files up to 10MB'}
                  </p>
                </div>

                {file && (
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <CheckCircle size={12} />
                    File Selected
                  </span>
                )}
              </div>
            )}

            {/* Paste Text Area */}
            {activeTab === 'paste' && (
              <div className="space-y-3">
                <textarea
                  rows={10}
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  placeholder="Paste your raw resume text here including Summary, Work Experience bullets, Skills, and Education..."
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 text-white text-xs placeholder-white/30 focus:outline-none focus:border-purple-400 font-mono leading-relaxed"
                />
              </div>
            )}

            {error && (
              <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{error}</span>
              </p>
            )}

            {/* Action CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
              <p className="text-xs text-white/40">
                🔒 Your resume is parsed securely via encrypted memory buffers and never shared.
              </p>

              <button
                type="button"
                disabled={loading || (activeTab === 'upload' && !file) || (activeTab === 'paste' && !pasteText.trim())}
                onClick={handleAnalyze}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs transition-all shadow-xl shadow-purple-600/30 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>{stepText}</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Audit Resume with Gemini</span>
                  </>
                )}
              </button>
            </div>

          </motion.div>
        )}

        {/* AUDIT REPORT DASHBOARD (Rendered once audit completes) */}
        {auditResult && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            
            {/* Top Score Banner */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#130d22] via-[#0d0917] to-[#070707] border border-purple-500/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full border border-purple-400/40 bg-purple-500/20 text-purple-300 font-semibold">
                    Audit Complete
                  </span>
                  <span className="text-xs text-white/50">{auditResult.candidateName} · {auditResult.detectedTitle}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold elsie-black text-white">
                  ATS Readiness Score: {auditResult.overallScore}/100
                </h2>
                <p className="text-xs md:text-sm text-white/70 leading-relaxed font-sans">
                  {auditResult.summaryVerdict}
                </p>
              </div>

              <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-black/60 border border-purple-500/30 shrink-0 min-w-36 text-center">
                <p className="text-4xl font-extrabold elsie-black text-white">
                  {auditResult.overallScore}
                  <span className="text-base text-white/40 font-sans">/100</span>
                </p>
                <span className={`text-[11px] font-semibold mt-1 px-2.5 py-0.5 rounded-full border ${
                  auditResult.overallScore >= 85 
                    ? 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10' 
                    : auditResult.overallScore >= 70 
                      ? 'border-amber-500/40 text-amber-300 bg-amber-500/10' 
                      : 'border-rose-500/40 text-rose-300 bg-rose-500/10'
                }`}>
                  {auditResult.tier}
                </span>
              </div>
            </div>

            {/* 4 Core ATS Metrics Breakdown */}
            {auditResult.metrics && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { key: 'actionVerbs', label: 'Action Verb Impact', ...auditResult.metrics.actionVerbs },
                  { key: 'quantifiableMetrics', label: 'Quantifiable Metrics', ...auditResult.metrics.quantifiableMetrics },
                  { key: 'keywordDensity', label: 'Keyword Density', ...auditResult.metrics.keywordDensity },
                  { key: 'formattingStructure', label: 'Formatting & Layout', ...auditResult.metrics.formattingStructure },
                ].map((m) => (
                  <div key={m.key} className="p-5 rounded-2xl bg-[#0a0a0a] border border-white/10 space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-semibold text-white/70">{m.label}</span>
                      <span className="text-xs font-mono font-bold text-white">{m.score}/{m.max || 25}</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          m.score >= 20 ? 'bg-emerald-400' : m.score >= 15 ? 'bg-amber-400' : 'bg-rose-400'
                        }`}
                        style={{ width: `${(m.score / (m.max || 25)) * 100}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-white/50 leading-relaxed pt-1">
                      {m.feedback}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Strengths & Red Flags Side-by-Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Strengths */}
              <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-emerald-500/20 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle size={18} />
                  <h3 className="text-sm font-bold uppercase tracking-wider">Candidate Strengths</h3>
                </div>
                <ul className="space-y-2 text-xs text-white/80">
                  {(auditResult.strengths || []).map((s, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span className="leading-relaxed">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Red Flags / Rejection Risks */}
              <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-rose-500/20 space-y-3">
                <div className="flex items-center gap-2 text-rose-400">
                  <ShieldAlert size={18} />
                  <h3 className="text-sm font-bold uppercase tracking-wider">Critical ATS Rejection Risks</h3>
                </div>
                <ul className="space-y-2 text-xs text-white/80">
                  {(auditResult.redFlags || []).map((r, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold">✕</span>
                      <span className="leading-relaxed">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Missing Keywords Radar */}
            {auditResult.missingCrucialKeywords && auditResult.missingCrucialKeywords.length > 0 && (
              <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Flame size={16} />
                    <h3 className="text-sm font-bold uppercase tracking-wider">Missing Industry Keywords</h3>
                  </div>
                  <span className="text-[11px] text-white/40">Incorporate these to pass corporate ATS screens</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {auditResult.missingCrucialKeywords.map((kw, i) => (
                    <span key={i} className="text-xs px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 font-mono">
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Line-by-Line AI Rewrite Transformations */}
            {auditResult.lineRewrites && auditResult.lineRewrites.length > 0 && (
              <div className="p-6 md:p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 space-y-4">
                <div className="flex items-center gap-2 text-purple-300">
                  <Wand2 size={18} />
                  <h3 className="text-base font-bold elsie-black text-white">Line-by-Line AI Optimization Benchmark</h3>
                </div>
                <p className="text-xs text-white/50">
                  Here is how senior technical recruiters recommend rewriting passive bullet points from your resume:
                </p>

                <div className="space-y-4 pt-2">
                  {auditResult.lineRewrites.map((rw, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-semibold text-rose-400 tracking-wider">Before (Current Line)</span>
                        <p className="text-xs text-white/60 line-through decoration-rose-500/60 font-mono bg-black/40 p-2.5 rounded-xl border border-white/5">
                          "{rw.original}"
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-semibold text-emerald-400 tracking-wider">After (AI Optimized)</span>
                        <p className="text-xs text-white font-medium bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-500/30 leading-relaxed">
                          "{rw.improved}"
                        </p>
                      </div>

                      <p className="text-[11px] text-purple-300/80 leading-relaxed italic">
                        💡 Rationale: {rw.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Actions Row */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/30 via-[#0e0a17] to-[#0a0a0a] border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-white elsie-black">Ready to fix these red flags automatically?</p>
                <p className="text-xs text-white/60">
                  Import this parsed resume into CraftCV's Builder to apply these improvements with our Autonomous Copilot.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleGoToViva}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl border border-white/20 hover:bg-white/10 text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  <GraduationCap size={14} />
                  <span>Practice Viva</span>
                </button>

                <button
                  type="button"
                  onClick={handleImportToBuilder}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-white text-black font-semibold text-xs hover:bg-white/90 transition-colors cursor-pointer shadow-lg"
                >
                  <span>Open in Builder</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

          </motion.div>
        )}

      </main>
    </div>
  )
}
