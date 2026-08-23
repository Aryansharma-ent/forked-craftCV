import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { FileText, Download, Star, Plus, TrendingUp, Clock, CheckCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import resume from '../assets/resume.png'
import resume2 from '../assets/resume2.png'
import resume3 from '../assets/resume3.png'
import resume4 from '../assets/resume4.png'

const stats = [
  { icon: FileText, value: '3',   label: 'Resumes Created' },
  { icon: Download, value: '12',  label: 'Total Downloads' },
  { icon: Star,     value: '87%', label: 'Avg. ATS Score'  },
]

const resumes = [
  { name: 'Software Engineer Resume',  template: 'Apex',  lastEdited: '2 hours ago', atsScore: 92, img: resume3 },
  { name: 'Product Manager — Meta',    template: 'Nova',  lastEdited: 'Yesterday',   atsScore: 88, img: resume2 },
  { name: 'Full Stack Dev — Startup',  template: 'Slate', lastEdited: '3 days ago',  atsScore: 81, img: resume4 },
]

const tips = [
  {
    icon: CheckCircle,
    title: 'Keep it to one page',
    desc: 'Recruiters spend an average of 6 seconds on a resume. Clarity and brevity win every time.',
  },
  {
    icon: TrendingUp,
    title: 'Tailor for each job',
    desc: "Mirror keywords from the job description to pass ATS filters and catch the hiring manager's eye.",
  },
  {
    icon: Clock,
    title: 'Quantify achievements',
    desc: 'Use numbers wherever possible — "increased revenue by 30%" beats "improved sales" every time.',
  },
]

export default function Dashboard() {
  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 md:px-8 pt-12 pb-24">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl elsie-black text-white leading-tight">
              Good morning, Alex.
            </h1>
            <p className="text-white/50 text-sm mt-1">Here's where you left off.</p>
          </div>
          <Link
            to="/builder"
            className="inline-flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-2xl font-medium hover:bg-white/90 transition-colors self-start sm:self-auto whitespace-nowrap"
          >
            <Plus size={16} />
            New Resume
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map(({ icon: Icon, value, label }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 flex flex-col gap-3"
            >
              <Icon size={22} className="text-white/40" />
              <p className="text-4xl elsie-black text-white leading-none">{value}</p>
              <p className="text-white/50 text-sm">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Your Resumes */}
        <h2 className="text-2xl elsie-black text-white mt-12 mb-6">Your Resumes</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {resumes.map((r) => (
            <div
              key={r.name}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-all group"
            >
              {/* Preview Image */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={r.img}
                  alt={r.name}
                  className="w-full h-full object-cover group-hover:brightness-110 transition duration-300"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Link
                    to="/builder"
                    className="border border-white/40 rounded-xl px-4 py-2 text-white text-sm hover:bg-white/10 transition-colors"
                  >
                    Edit
                  </Link>
                  <button className="bg-white text-black rounded-xl px-4 py-2 text-sm font-medium hover:bg-white/90 transition-colors">
                    Download
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4">
                <p className="text-sm font-medium text-white truncate">{r.name}</p>
                <p className="text-xs text-white/40 mt-0.5">{r.template}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                    ATS {r.atsScore}%
                  </span>
                  <span className="text-xs text-white/40">Edited {r.lastEdited}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Resume Card */}
          <Link
            to="/builder"
            className="border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 py-16 hover:border-white/30 transition-all cursor-pointer min-h-[260px] group"
          >
            <Plus size={28} className="text-white/30 group-hover:text-white/50 transition-colors" />
            <span className="text-white/40 text-sm group-hover:text-white/60 transition-colors">
              New Resume
            </span>
          </Link>
        </div>

        {/* Quick Tips */}
        <h2 className="text-xl elsie-black text-white mt-16 mb-4">Quick Tips</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {tips.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 flex gap-4 items-start"
            >
              <Icon size={20} className="text-white/30 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-white">{title}</p>
                <p className="text-xs text-white/50 mt-1 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
