import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router'
import { 
  LuPlus as Plus, 
  LuX as X, 
  LuPenLine as Edit3, 
  LuArrowRight as ArrowRight,
  LuTrash2 as Trash2,
  LuFileText as FileText
} from 'react-icons/lu'
import { FaGithub as Github } from 'react-icons/fa6'
import Navbar from '@/components/Navbar'
import resume2 from '../assets/resume2.png'
import resume3 from '../assets/resume3.png'
import resume4 from '../assets/resume4.png'
import resume from '../assets/resume.png'

const API_URL = 'http://localhost:5000/api/portfolios'

const templateImages = {
  apex: resume3,
  nova: resume2,
  slate: resume4,
  minimal: resume
}

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('craftcv_user')
      if (userStr) {
        setCurrentUser(JSON.parse(userStr))
      }
    } catch (e) {}

    loadResumes()
  }, [])

  // READ: Fetch all resumes from backend
  const loadResumes = async () => {
    setLoading(true)
    try {
      const response = await fetch(API_URL)
      const data = await response.json()
      if (Array.isArray(data)) {
        setResumes(data)
      } else {
        setResumes([])
      }
    } catch (err) {
      console.log('Error loading resumes:', err)
      setResumes([])
    } finally {
      setLoading(false)
    }
  }

  // DELETE: Delete a resume by ID
  const handleDeleteResume = async (id, title) => {
    const isConfirmed = window.confirm(`Delete "${title || 'this resume'}"?`)
    if (!isConfirmed) return

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        alert('Resume deleted successfully!')
        loadResumes() // refresh the list
      } else {
        alert('Failed to delete resume.')
      }
    } catch (err) {
      console.log('Delete error:', err)
      alert('Error deleting resume.')
    }
  }

  const handleSelectMode = (mode) => {
    setShowModal(false)
    navigate(`/builder?mode=${mode}`)
  }

  const userName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Alex'

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 md:px-8 pt-12 pb-24">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl elsie-black text-white leading-tight">
              Good morning, {userName}.
            </h1>
            <p className="text-white/50 text-sm mt-1">Manage, edit, or create your resumes.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-2xl font-medium hover:bg-white/90 transition-colors self-start sm:self-auto whitespace-nowrap cursor-pointer shadow-md text-sm"
          >
            <Plus size={16} />
            New Resume
          </button>
        </div>

        {/* Interview Prep Callout */}
        <div className="mt-8 p-6 rounded-2xl bg-[#0a0a0a] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold elsie-black text-white">
              Interview & Viva Preparation
            </h3>
            <p className="text-sm text-white/50">
              Generate technical interview questions based on your resume. Practice defending your projects before the actual interview.
            </p>
          </div>
          <Link
            to="/interview"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-white/90 transition-all shrink-0 cursor-pointer"
          >
            <span>Open Interview Prep</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Your Resumes Section Header */}
        <div className="flex items-center justify-between mt-12 mb-6">
          <h2 className="text-2xl elsie-black text-white">Your Resumes ({resumes.length})</h2>
          <button 
            onClick={loadResumes} 
            className="text-xs text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            Refresh List ⟳
          </button>
        </div>

        {/* Resumes Grid / Empty State */}
        {loading ? (
          <div className="p-12 text-center rounded-2xl bg-[#0a0a0a] border border-white/10 text-white/60">
            Loading resumes from database...
          </div>
        ) : resumes.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#0a0a0a] border border-white/10 space-y-3">
            <FileText size={32} className="mx-auto text-white/30" />
            <h3 className="text-lg font-semibold text-white">No resumes created yet</h3>
            <p className="text-sm text-white/50 max-w-md mx-auto">
              Create your first resume to store it in MongoDB.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded-xl text-xs font-semibold hover:bg-white/90 cursor-pointer"
            >
              <Plus size={14} />
              Create First Resume
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {resumes.map((r) => {
              const previewImg = templateImages[r.template?.toLowerCase()] || resume3
              const resumeTitle = r.title || r.personalInfo?.fullName || 'Untitled Resume'
              const updatedDate = r.updatedAt ? new Date(r.updatedAt).toLocaleDateString() : 'Recently'
              const templateName = r.template ? r.template.toUpperCase() : 'APEX'

              return (
                <div
                  key={r._id}
                  className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-all flex flex-col justify-between"
                >
                  {/* Preview Image */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-black/40">
                    <img
                      src={previewImg}
                      alt={resumeTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Card Meta & CRUD Actions */}
                  <div className="p-5 space-y-3">
                    <div>
                      <p className="font-semibold text-sm text-white truncate">{resumeTitle}</p>
                      <p className="text-white/40 text-xs mt-0.5">Updated: {updatedDate} · {templateName}</p>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                      {/* UPDATE / EDIT */}
                      <Link
                        to={`/builder?id=${r._id}&mode=${r.mode || 'manual'}&template=${(r.template || 'apex').toLowerCase()}`}
                        className="flex-1 text-center bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl py-2 text-xs font-medium transition-colors"
                      >
                        Edit Resume
                      </Link>

                      {/* DELETE */}
                      <button
                        onClick={() => handleDeleteResume(r._id, resumeTitle)}
                        title="Delete this resume"
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs transition-colors cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </main>

      {/* Creation Mode Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-xl w-full text-white relative shadow-2xl"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-5 right-5 text-white/40 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                New Project
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold elsie-black mt-1 mb-2">
                How would you like to build?
              </h2>
              <p className="text-sm text-white/50 mb-6">
                Choose the workflow that best fits your needs. Both options support all templates.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Option 1: Manual Builder */}
                <div
                  onClick={() => handleSelectMode('manual')}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer group"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white mb-4 group-hover:scale-105 transition-transform">
                      <Edit3 size={20} />
                    </div>
                    <h3 className="text-base font-bold text-white mb-1.5 flex items-center gap-1.5">
                      Manual Builder
                    </h3>
                    <p className="text-xs text-white/50 leading-relaxed">
                      Fill in profile details from scratch, craft custom bullet points, and choose templates.
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center text-xs font-semibold text-white/80 group-hover:text-white">
                    <span>Build Manually</span>
                    <ArrowRight size={14} className="ml-auto group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Option 2: 1-Click GitHub */}
                <div
                  onClick={() => handleSelectMode('github')}
                  className="bg-gradient-to-tr from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 border border-white/20 hover:border-white/40 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute top-3 right-3 text-[10px] font-bold bg-white text-black px-2 py-0.5 rounded-full">
                    Instant
                  </div>
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                      <Github size={20} />
                    </div>
                    <h3 className="text-base font-bold text-white mb-1.5 flex items-center gap-1.5">
                      1-Click GitHub
                    </h3>
                    <p className="text-xs text-white/50 leading-relaxed">
                      Enter GitHub handle to auto-fetch repositories, top starred projects, and language skills.
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center text-xs font-semibold text-white group-hover:text-white">
                    <span>Build via GitHub</span>
                    <ArrowRight size={14} className="ml-auto group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
