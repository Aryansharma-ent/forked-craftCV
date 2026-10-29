import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { LuArrowRight as ArrowRight } from 'react-icons/lu';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import resumeMinimal from '../assets/resume.png';
import resumeNova from '../assets/resume2.png';
import resumeApex from '../assets/resume3.png';
import resumeSlate from '../assets/resume4.png';

const templates = [
  {
    id: 'apex',
    name: 'Apex',
    badge: 'Popular',
    desc: 'Dark slate header band with single-column ATS-friendly layout. Perfect for senior and executive roles.',
    image: resumeApex,
  },
  {
    id: 'nova',
    name: 'Nova',
    badge: 'Creative',
    desc: 'Modern 2-column layout with a rose-accent sidebar highlighting skills, contact, and education.',
    image: resumeNova,
  },
  {
    id: 'slate',
    name: 'Slate',
    badge: 'Technical',
    desc: 'High-contrast dark theme with monospace typography accents, green skill chips, and timeline view.',
    image: resumeSlate,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    badge: 'Classic ATS',
    desc: 'Classic Harvard ATS layout with elegant serif typography and clean horizontal rule dividers.',
    image: resumeMinimal,
  },
];

export default function Templates() {
  return (
    <div className="bg-black min-h-screen text-white flex flex-col">
      <Navbar />

      <section className="pt-24 pb-12 max-w-7xl mx-auto px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="flex flex-col items-center text-center gap-4"
        >
          <h1 className="elsie-black text-5xl md:text-7xl leading-tight">
            Browse Templates
          </h1>
          <p className="text-white/60 text-lg max-w-xl">
            Pick a design that speaks for you. Every template is crafted to pass ATS scans and impress hiring managers.
          </p>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-8 w-full pb-20 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-all duration-300 group flex flex-col"
            >
              <div className="overflow-hidden aspect-[3/4] w-full bg-[#111] relative">
                <img
                  src={template.image}
                  alt={`${template.name} resume template`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 text-[10px] uppercase tracking-wider bg-black/80 backdrop-blur-md text-white/80 px-2.5 py-1 rounded-full border border-white/10 font-semibold">
                  {template.badge}
                </span>
              </div>

              <div className="p-5 flex flex-col gap-3 flex-1">
                <div>
                  <h3 className="text-base font-bold text-white">{template.name}</h3>
                  <p className="text-xs text-white/50 mt-1 leading-relaxed">
                    {template.desc}
                  </p>
                </div>

                <div className="mt-auto pt-2">
                  <Link
                    to={`/builder?template=${template.id}`}
                    className="w-full flex items-center justify-center gap-2 bg-white text-black px-4 py-2.5 rounded-xl hover:bg-white/90 transition-all text-xs font-semibold cursor-pointer"
                  >
                    <span>Use {template.name}</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
