import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { Plus, Trash2, Download, Eye, User, Briefcase, GraduationCap, Zap, FileText, CheckCircle, ChevronLeft, Minus } from 'lucide-react'
import resume3 from '../assets/resume3.png'
import resume2 from '../assets/resume2.png'
import resume4 from '../assets/resume4.png'
import resume from '../assets/resume.png'

const mockPersonal = {
  name: 'Alex Chen',
  title: 'Senior Software Engineer',
  email: 'alex.chen@email.com',
  phone: '+1 (555) 012-3456',
  location: 'San Francisco, CA',
  linkedin: 'linkedin.com/in/alexchen',
  website: 'alexchen.dev',
  summary: 'Experienced software engineer with 6+ years building scalable web applications. Passionate about clean architecture, developer experience, and shipping products that users love.',
}

const mockExperience = [
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
]

const mockEducation = [
  { id: 1, school: 'University of California, Berkeley', degree: 'B.S. Computer Science', start: '2015', end: '2019', gpa: '3.8' },
]

const mockSkills = ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Redis', 'AWS', 'Go', 'GraphQL', 'Docker', 'Kubernetes']

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

function Field({ label, value, multiline = false, placeholder = '' }) {
  if (multiline) {
    return (
      <div className="flex flex-col gap-1.5">
        {label && <label className="text-xs text-white/40">{label}</label>}
        <textarea
          defaultValue={value}
          placeholder={placeholder}
          rows={4}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/30 resize-none w-full leading-relaxed"
        />
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs text-white/40">{label}</label>}
      <input
        type="text"
        defaultValue={value}
        placeholder={placeholder}
        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/30 w-full"
      />
    </div>
  )
}

function ResumePreview() {
  return (
    <div className="bg-white rounded-xl shadow-2xl overflow-hidden text-black" style={{ fontFamily: 'Georgia, serif' }}>
      <div className="bg-gray-900 text-white px-8 py-7">
        <h1 className="text-2xl font-bold tracking-tight">{mockPersonal.name}</h1>
        <p className="text-sm text-gray-300 mt-0.5">{mockPersonal.title}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-400">
          <span>{mockPersonal.email}</span>
          <span>{mockPersonal.phone}</span>
          <span>{mockPersonal.location}</span>
          <span>{mockPersonal.linkedin}</span>
        </div>
      </div>

      <div className="px-8 py-6 space-y-5 text-[11px] leading-relaxed">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-1 mb-2">Summary</p>
          <p className="text-gray-700">{mockPersonal.summary}</p>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-1 mb-3">Experience</p>
          <div className="space-y-4">
            {mockExperience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <p className="font-bold text-gray-900 text-xs">{exp.role}</p>
                  <p className="text-gray-400 text-[10px]">{exp.start} – {exp.end}</p>
                </div>
                <p className="text-gray-500">{exp.company} · {exp.location}</p>
                <ul className="mt-1.5 space-y-1 list-disc list-inside text-gray-700">
                  {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-1 mb-2">Education</p>
          {mockEducation.map((edu) => (
            <div key={edu.id} className="flex justify-between items-baseline">
              <div>
                <p className="font-bold text-gray-900 text-xs">{edu.degree}</p>
                <p className="text-gray-500">{edu.school}</p>
              </div>
              <p className="text-gray-400 text-[10px]">{edu.start} – {edu.end}</p>
            </div>
          ))}
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-1 mb-2">Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {mockSkills.map((s) => (
              <span key={s} className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full text-[10px]">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Builder() {
  return (
    <div className="bg-black min-h-screen text-white flex flex-col">

      <header className="flex items-center justify-between px-6 h-14 border-b border-white/10 bg-black sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors text-sm">
            <ChevronLeft size={15} />
            Back
          </Link>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-sm font-medium text-white truncate max-w-[160px]">Software Engineer Resume</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium text-green-400 bg-green-500/10 border-green-500/20">
            <CheckCircle size={12} />
            ATS Score: 92/100
          </div>
          <button className="flex items-center gap-2 text-sm bg-white text-black px-5 py-1.5 rounded-xl font-medium hover:bg-white/90 transition-colors">
            <Download size={14} />
            Export PDF
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        <aside className="hidden lg:flex flex-col w-52 border-r border-white/10 bg-black py-6 shrink-0">
          <p className="text-[10px] uppercase tracking-widest text-white/30 px-5 mb-3">Sections</p>
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <div
              key={id}
              className={`flex items-center gap-3 px-5 py-2.5 text-sm text-left w-full ${
                id === 'personal'
                  ? 'text-white bg-white/8 border-r-2 border-white'
                  : 'text-white/50'
              }`}
            >
              <Icon size={14} className="shrink-0" />
              {label}
            </div>
          ))}

          <div className="mt-auto px-5">
            <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3">Template</p>
            <div className="grid grid-cols-2 gap-2">
              {templatePreviews.map((t, i) => (
                <div
                  key={t.id}
                  className={`rounded-lg overflow-hidden border-2 ${i === 0 ? 'border-white' : 'border-white/10'}`}
                >
                  <img src={t.img} alt={t.name} className="w-full object-cover aspect-[3/4]" />
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-2 lg:hidden">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <div
                key={id}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs whitespace-nowrap shrink-0 ${
                  id === 'personal' ? 'bg-white text-black font-medium' : 'border border-white/20 text-white/60'
                }`}
              >
                <Icon size={12} />
                {label}
              </div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-xl elsie-black text-white">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Full Name"            value={mockPersonal.name}     />
              <Field label="Professional Title"   value={mockPersonal.title}    />
              <Field label="Email Address"        value={mockPersonal.email}    />
              <Field label="Phone Number"         value={mockPersonal.phone}    />
              <Field label="Location"             value={mockPersonal.location} />
              <Field label="LinkedIn URL"         value={mockPersonal.linkedin} />
              <Field label="Website / Portfolio"  value={mockPersonal.website}  />
            </div>

            <h2 className="text-xl elsie-black text-white pt-4">Professional Summary</h2>
            <Field value={mockPersonal.summary} multiline />

            <div className="flex items-center justify-between pt-4">
              <h2 className="text-xl elsie-black text-white">Work Experience</h2>
              <button className="flex items-center gap-1.5 text-xs border border-white/20 text-white/60 hover:border-white/40 hover:text-white px-3 py-2 rounded-xl transition-all">
                <Plus size={12} />
                Add Position
              </button>
            </div>
            {mockExperience.map((exp) => (
              <div key={exp.id} className="border border-white/10 rounded-2xl p-5 space-y-4">
                <p className="text-sm font-medium text-white">{exp.role} at {exp.company}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Company"    value={exp.company}  />
                  <Field label="Job Title"  value={exp.role}     />
                  <Field label="Start Date" value={exp.start}    />
                  <Field label="End Date"   value={exp.end}      />
                  <Field label="Location"   value={exp.location} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-white/40">Achievements / Responsibilities</label>
                  {exp.bullets.map((b, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <span className="text-white/20 mt-3 text-lg leading-none">·</span>
                      <input
                        defaultValue={b}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/30"
                      />
                      <button className="text-white/20 hover:text-red-400 transition-colors mt-2.5">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between pt-4">
              <h2 className="text-xl elsie-black text-white">Education</h2>
              <button className="flex items-center gap-1.5 text-xs border border-white/20 text-white/60 hover:border-white/40 hover:text-white px-3 py-2 rounded-xl transition-all">
                <Plus size={12} />
                Add Education
              </button>
            </div>
            {mockEducation.map((edu) => (
              <div key={edu.id} className="border border-white/10 rounded-2xl p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="School / University" value={edu.school} />
                  <Field label="Degree & Major"       value={edu.degree} />
                  <Field label="Start Year"           value={edu.start}  />
                  <Field label="End Year"             value={edu.end}    />
                  <Field label="GPA (optional)"       value={edu.gpa}    />
                </div>
              </div>
            ))}

            <h2 className="text-xl elsie-black text-white pt-4">Skills</h2>
            <div className="flex flex-wrap gap-2 p-4 border border-white/10 rounded-2xl min-h-28">
              {mockSkills.map((s) => (
                <div key={s} className="flex items-center gap-2 bg-white/8 border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white group">
                  {s}
                  <button className="text-white/20 hover:text-red-400 transition-colors">
                    <Minus size={12} />
                  </button>
                </div>
              ))}
              <input
                placeholder="+ Add skill..."
                className="bg-transparent text-white text-sm placeholder-white/20 focus:outline-none px-2 py-1.5 min-w-[100px]"
              />
            </div>
          </motion.div>
        </main>

        <aside className="hidden xl:flex flex-col w-[480px] border-l border-white/10 bg-[#0a0a0a] shrink-0">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <span className="text-sm font-medium text-white">Live Preview</span>
            <span className="text-xs text-white/40">Template: <span className="text-white/70">Apex</span></span>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="transform scale-[0.72] origin-top-left w-[138.9%]">
              <ResumePreview />
            </div>
          </div>
        </aside>

      </div>
    </div>
  )
}