import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LuGraduationCap as GraduationCap, 
  LuSparkles as Sparkles, 
  LuChevronLeft as ChevronLeft, 
  LuCircleCheck as CheckCircle, 
  LuSend as Send, 
  LuLoaderCircle as Loader2, 
  LuLightbulb as Lightbulb, 
  LuAward as Award, 
  LuArrowRight as ArrowRight,
  LuCpu as Cpu,
  LuLayers as Layers,
  LuRotateCcw as RotateCcw,
  LuFlame as Flame,
  LuUpload as Upload,
  LuFileText as FileText,
  LuX as X
} from 'react-icons/lu'
import Navbar from '@/components/Navbar'
import { agentApi } from '../lib/api'

const INTERVIEW_PRESETS = [
  { id: 'viva', label: '🎓 College CSE Viva', desc: 'Focuses on architectural justification, trade-offs, and project defense' },
  { id: 'faang', label: '💻 FAANG / Big Tech', desc: 'Deep-dives into systems bottlenecks, concurrency, and real-world metrics' },
  { id: 'system_design', label: '🏗️ System Architecture', desc: 'Scalability, microservices, caching layers, and database sharding' },
]

export default function InterviewPrep() {
  const [searchParams] = useSearchParams()
  const initialType = searchParams.get('type') || 'viva'

  const [interviewType, setInterviewType] = useState(initialType)
  const [targetRole, setTargetRole] = useState('Senior Full Stack Engineer')
  const [targetCompany, setTargetCompany] = useState('Google / Top Tech')
  
  // PDF Upload State
  const [pdfFile, setPdfFile] = useState(null)
  const [resumeMode, setResumeMode] = useState('upload') // 'upload' | 'profile'
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  // Resume context (fallback profile if no PDF is uploaded)
  const [resumeData, setResumeData] = useState(() => {
    try {
      const stored = localStorage.getItem('craftcv_current_resume')
      if (stored) return JSON.parse(stored)
    } catch (e) {}
    return {
      personal: { name: 'Alex Chen', title: 'Senior Software Engineer' },
      skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'AWS'],
      experience: [
        {
          company: 'Stripe',
          role: 'Software Engineer',
          bullets: ['Rebuilt payments dashboard reducing load time by 60%', 'Shipped webhook system handling 2M+ events/day']
        }
      ]
    }
  })

  const [questions, setQuestions] = useState([])
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0)
  const [generating, setGenerating] = useState(false)
  const [stepText, setStepText] = useState('')
  const [candidateAnswer, setCandidateAnswer] = useState('')
  const [evaluating, setEvaluating] = useState(false)
  const [evaluationResult, setEvaluationResult] = useState(null)
  const [revealedModelAnswers, setRevealedModelAnswers] = useState({})

  // Automatically generate questions on initial mount with default
  useEffect(() => {
    handleGenerateQuestions()
  }, [interviewType])

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0])
      setResumeMode('upload')
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setPdfFile(e.dataTransfer.files[0])
      setResumeMode('upload')
    }
  }

  const handleGenerateQuestions = async () => {
    setGenerating(true)
    setEvaluationResult(null)
    setCandidateAnswer('')
    setStepText(pdfFile ? 'Reading uploaded PDF document...' : 'Analyzing candidate background...')

    const t1 = setTimeout(() => {
      setStepText('Gemini 2.5 extracting project claims & tech stack...')
    }, 1000)
    const t2 = setTimeout(() => {
      setStepText('Formulating challenging viva & technical questions...')
    }, 2000)

    try {
      const res = await agentApi.generateInterview(
        resumeData,
        `${targetRole} at ${targetCompany}`,
        interviewType,
        resumeMode === 'upload' ? pdfFile : null
      )
      if (res.success && res.data && res.data.length > 0) {
        setQuestions(res.data)
        setActiveQuestionIdx(0)
      }
    } catch (err) {
      console.error('Failed to generate viva questions:', err)
    } finally {
      clearTimeout(t1)
      clearTimeout(t2)
      setGenerating(false)
    }
  }

  const handleEvaluateAnswer = async () => {
    if (!candidateAnswer.trim() || !questions[activeQuestionIdx]) return
    setEvaluating(true)
    setEvaluationResult(null)
    try {
      const res = await agentApi.evaluateAnswer(
        questions[activeQuestionIdx].question,
        candidateAnswer.trim(),
        targetRole
      )
      if (res.success && res.data) {
        setEvaluationResult(res.data)
      }
    } catch (err) {
      console.error('Failed to evaluate answer:', err)
    } finally {
      setEvaluating(false)
    }
  }

  const toggleModelAnswer = (idx) => {
    setRevealedModelAnswers(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }))
  }

  const currentQ = questions[activeQuestionIdx]

  return (
    <div className="bg-black min-h-screen text-white flex flex-col font-sans">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 md:px-8 py-10 flex-1 w-full space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="space-y-1">
            <Link to="/dashboard" className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors mb-2">
              <ChevronLeft size={14} />
              Back to Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl elsie-black text-white">AI Viva &amp; Interview Simulator</h1>
              <span className="text-xs px-2.5 py-1 rounded-full border border-purple-500/40 bg-purple-500/10 text-purple-300 font-mono">
                Gemini 2.5
              </span>
            </div>
            <p className="text-xs sm:text-sm text-white/60 max-w-2xl">
              Upload your actual resume in PDF format. Gemini reads your real projects, claims, and technologies, then generates examiner viva questions to prepare you for college defense and technical interviews.
            </p>
          </div>

          <Link
            to="/builder"
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-medium text-white transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span>Open Resume Builder</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* 1. Resume Source Selection: Upload PDF or Use Profile */}
        <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Upload size={14} className="text-purple-400" />
                Resume Source for Question Generation
              </p>
              <p className="text-xs text-white/50 mt-0.5">
                Upload your real PDF resume, or switch to the pre-filled candidate profile.
              </p>
            </div>

            <div className="flex bg-[#111] p-1 rounded-2xl border border-white/10 text-xs font-medium self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setResumeMode('upload')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  resumeMode === 'upload' ? 'bg-white text-black font-semibold' : 'text-white/60 hover:text-white'
                }`}
              >
                📄 Upload PDF Resume
              </button>
              <button
                type="button"
                onClick={() => setResumeMode('profile')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  resumeMode === 'profile' ? 'bg-white text-black font-semibold' : 'text-white/60 hover:text-white'
                }`}
              >
                ⚡ Use Builder Profile
              </button>
            </div>
          </div>

          {/* PDF Dropzone */}
          {resumeMode === 'upload' && (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-4 ${
                isDragging 
                  ? 'border-purple-400 bg-purple-950/20' 
                  : pdfFile 
                    ? 'border-emerald-500/50 bg-emerald-950/10' 
                    : 'border-white/15 bg-white/5 hover:border-white/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">
                  {pdfFile ? <FileText size={22} className="text-emerald-400" /> : <Upload size={22} />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {pdfFile ? pdfFile.name : 'Click to select or drag & drop your PDF resume'}
                  </p>
                  <p className="text-xs text-white/50">
                    {pdfFile ? `${(pdfFile.size / 1024).toFixed(1)} KB · Ready for AI Question Generation` : 'Gemini 2.5 reads multi-column PDFs, tables, and project bullets directly'}
                  </p>
                </div>
              </div>

              {pdfFile ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <CheckCircle size={12} />
                    PDF Loaded
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setPdfFile(null)
                    }}
                    className="p-1 text-white/40 hover:text-rose-400 transition-colors"
                  >
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <span className="text-xs font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-xl shrink-0">
                  Browse PDF File
                </span>
              )}
            </div>
          )}

          {resumeMode === 'profile' && (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/70 flex items-center justify-between">
              <div>
                <span className="font-semibold text-white">Active Profile: </span>
                <span>{resumeData.personal?.name || 'Candidate'} · {resumeData.personal?.title || 'Engineer'} ({(resumeData.skills || []).slice(0, 5).join(', ')})</span>
              </div>
              <span className="text-[11px] text-white/40">From CraftCV Builder</span>
            </div>
          )}
        </div>

        {/* 2. Target Mode Presets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {INTERVIEW_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => setInterviewType(p.id)}
              className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                interviewType === p.id
                  ? 'border-purple-500 bg-purple-950/20 shadow-lg shadow-purple-500/10'
                  : 'border-white/10 bg-[#0a0a0a] hover:border-white/20'
              }`}
            >
              <p className="text-xs font-bold text-white mb-1">{p.label}</p>
              <p className="text-[11px] text-white/50 leading-relaxed">{p.desc}</p>
            </button>
          ))}
        </div>

        {/* 3. Role & Question Refresh Bar */}
        <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-white/10 flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full flex gap-3">
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="Target Role (e.g. Distributed Systems Engineer)"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs placeholder-white/30 focus:outline-none focus:border-white/30"
            />
            <input
              type="text"
              value={targetCompany}
              onChange={(e) => setTargetCompany(e.target.value)}
              placeholder="Target Company / Review Panel (e.g. Google or External Viva)"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs placeholder-white/30 focus:outline-none focus:border-white/30"
            />
          </div>

          <button
            onClick={handleGenerateQuestions}
            disabled={generating}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-white/90 transition-colors disabled:opacity-40 cursor-pointer shrink-0 shadow-md"
          >
            {generating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            <span>{generating ? 'Generating with Gemini...' : (pdfFile ? 'Generate from Uploaded PDF' : 'Generate Questions')}</span>
          </button>
        </div>

        {/* Question Simulator Arena */}
        {generating ? (
          <div className="p-16 rounded-3xl bg-[#0a0a0a] border border-white/10 text-center space-y-4">
            <Loader2 size={36} className="animate-spin text-purple-400 mx-auto" />
            <p className="text-lg font-bold text-white elsie-black">{stepText}</p>
            <p className="text-xs text-white/50 max-w-md mx-auto">
              {pdfFile 
                ? `Inspecting ${pdfFile.name} to challenge your architectural trade-offs, metrics, and technology selections.`
                : 'Formulating rigorous questions targeting your projects, database design, and systems architecture.'}
            </p>
          </div>
        ) : questions.length === 0 ? (
          <div className="p-12 rounded-3xl bg-[#0a0a0a] border border-white/10 text-center space-y-3">
            <p className="text-sm text-white/60">No viva questions generated yet.</p>
            <button
              onClick={handleGenerateQuestions}
              className="px-5 py-2.5 rounded-xl bg-white text-black text-xs font-semibold cursor-pointer"
            >
              Generate Questions Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Questions List (Pills) */}
            <div className="lg:col-span-4 space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">
                  Viva Questions ({questions.length})
                </p>
                {pdfFile && (
                  <span className="text-[10px] text-emerald-400 font-mono">From PDF</span>
                )}
              </div>

              {questions.map((q, idx) => (
                <div
                  key={q.id || idx}
                  onClick={() => {
                    setActiveQuestionIdx(idx)
                    setEvaluationResult(null)
                    setCandidateAnswer('')
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    activeQuestionIdx === idx
                      ? 'border-purple-500/80 bg-purple-950/30 shadow-lg'
                      : 'border-white/10 bg-[#0a0a0a] hover:border-white/25'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-white/70">
                      {q.category}
                    </span>
                    <span className={`text-[10px] font-medium ${q.difficulty === 'Hard' ? 'text-rose-400' : 'text-amber-400'}`}>
                      {q.difficulty}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-white/90 line-clamp-2 leading-relaxed">
                    Q{idx + 1}: {q.question}
                  </p>
                </div>
              ))}
            </div>

            {/* Right Column: Active Question Arena & AI Evaluator */}
            <div className="lg:col-span-8 space-y-5">
              {currentQ && (
                <div className="p-6 md:p-8 rounded-3xl bg-[#0a0a0a] border border-white/15 space-y-6 shadow-xl">
                  
                  {/* Category & Examiner Context */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono px-2.5 py-1 rounded-full border border-purple-500/40 bg-purple-500/10 text-purple-300">
                        {currentQ.category}
                      </span>
                      <span className="text-xs text-white/40">Question {activeQuestionIdx + 1} of {questions.length}</span>
                    </div>

                    <h2 className="text-lg md:text-xl font-bold text-white elsie-black leading-snug">
                      "{currentQ.question}"
                    </h2>

                    {currentQ.whyAsked && (
                      <div className="flex items-start gap-2 p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70 leading-relaxed">
                        <Lightbulb size={14} className="text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-white">Why This Is Asked: </span>
                          <span>{currentQ.whyAsked}</span>
                        </div>
                      </div>
                    )}

                    {currentQ.keyConcepts && currentQ.keyConcepts.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap pt-1">
                        <span className="text-[11px] text-white/40">Key concepts expected:</span>
                        {currentQ.keyConcepts.map((c, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/10">
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Candidate Answer Box */}
                  <div className="space-y-3 pt-3 border-t border-white/10">
                    <label className="text-xs font-semibold text-white uppercase tracking-wider block">
                      Your Response / Project Defense
                    </label>
                    <textarea
                      rows={5}
                      value={candidateAnswer}
                      onChange={(e) => setCandidateAnswer(e.target.value)}
                      placeholder="Type your explanation, technical architecture trade-offs, or bullet points as you would answer in the viva/interview..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-xs placeholder-white/30 focus:outline-none focus:border-purple-400 leading-relaxed"
                    />

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => toggleModelAnswer(activeQuestionIdx)}
                        className="text-xs text-purple-300 hover:text-purple-200 transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                      >
                        <Lightbulb size={13} />
                        <span>{revealedModelAnswers[activeQuestionIdx] ? 'Hide Benchmark Answer' : 'Reveal Model Answer & Rubric'}</span>
                      </button>

                      <button
                        type="button"
                        disabled={evaluating || !candidateAnswer.trim()}
                        onClick={handleEvaluateAnswer}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-purple-600/30 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {evaluating ? (
                          <>
                            <Loader2 size={13} className="animate-spin" />
                            <span>Grading Defense...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles size={13} />
                            <span>Evaluate My Answer</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Model Answer Drawer */}
                  {revealedModelAnswers[activeQuestionIdx] && currentQ.sampleAnswer && (
                    <div className="p-5 rounded-2xl bg-[#120d1a] border border-purple-500/30 space-y-2 animate-in fade-in">
                      <p className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                        <Award size={14} />
                        Senior Engineer Benchmark Answer
                      </p>
                      <p className="text-xs text-white/80 leading-relaxed">
                        {currentQ.sampleAnswer}
                      </p>
                    </div>
                  )}

                  {/* AI Evaluation Result Card */}
                  {evaluationResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 rounded-2xl bg-gradient-to-br from-[#120d1f] to-[#0a0a0a] border border-purple-500/40 space-y-4"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-white/40 tracking-wider">Evaluation Score</span>
                          <p className="text-2xl font-bold text-white flex items-center gap-2">
                            <span>{evaluationResult.score}/10</span>
                            <span className="text-xs font-normal text-purple-300">· {evaluationResult.verdict}</span>
                          </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 font-bold text-lg font-mono">
                          {evaluationResult.score >= 8 ? 'A' : evaluationResult.score >= 6 ? 'B' : 'C'}
                        </div>
                      </div>

                      {/* Strengths & Improvements */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1.5 bg-emerald-500/10 border border-emerald-500/20 p-3.5 rounded-xl">
                          <p className="font-bold text-emerald-400 flex items-center gap-1">
                            <CheckCircle size={13} />
                            Key Strengths
                          </p>
                          <ul className="space-y-1 text-white/80 list-disc list-inside">
                            {(evaluationResult.strengths || []).map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-1.5 bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-xl">
                          <p className="font-bold text-amber-400 flex items-center gap-1">
                            <Flame size={13} />
                            Areas for Improvement
                          </p>
                          <ul className="space-y-1 text-white/80 list-disc list-inside">
                            {(evaluationResult.improvements || []).map((imp, i) => (
                              <li key={i}>{imp}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Viva Presentation Tip */}
                      {evaluationResult.vivaTip && (
                        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80 leading-relaxed">
                          <span className="font-bold text-purple-300">💡 Academic Viva Tip: </span>
                          <span>{evaluationResult.vivaTip}</span>
                        </div>
                      )}
                    </motion.div>
                  )}

                </div>
              )}
            </div>

          </div>
        )}

      </main>
    </div>
  )
}
