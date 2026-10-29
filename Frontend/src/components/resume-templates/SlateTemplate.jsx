// Slate Template — full dark bg, monospace accents, emerald skill chips, timeline experience

export default function SlateTemplate({ personal, experience, education, skills }) {
  return (
    <div className="bg-neutral-900 rounded-xl shadow-2xl overflow-hidden text-neutral-100 font-sans text-xs leading-relaxed print:min-h-[297mm] print:h-[297mm] print:w-[210mm] print:text-[13px] print:rounded-none print:shadow-none flex flex-col justify-between h-full">

      {/* Header */}
      <div className="px-8 py-7 border-b border-neutral-700 print:px-12 print:py-10 shrink-0">
        <h1 className="text-2xl print:text-4xl font-black tracking-tight text-white">{personal.name || 'Your Name'}</h1>
        <p className="text-sm print:text-base text-emerald-400 mt-1 font-mono">{personal.title}</p>
        <div className="flex flex-wrap gap-x-6 gap-y-1.5 mt-4 text-xs print:text-[13px] text-neutral-400 font-mono">
          {personal.email    && <span>{personal.email}</span>}
          {personal.phone    && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.website  && <span>{personal.website}</span>}
        </div>
      </div>

      {/* Body — flex distributed */}
      <div className="flex-1 px-8 py-7 flex flex-col justify-between print:px-12 print:py-10 space-y-6 print:space-y-0">

        {/* Summary */}
        {personal.summary && (
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-emerald-500 mb-2.5">// summary</p>
            <p className="text-neutral-300 text-xs print:text-[13.5px] leading-relaxed">{personal.summary}</p>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-emerald-500 mb-2.5">// skills</p>
            <div className="flex flex-wrap gap-2">
              {skills.map((s, i) => (
                <span key={i} className="border border-emerald-500/40 text-emerald-400 px-3 py-1 rounded text-xs font-mono">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="my-2">
            <p className="text-xs font-mono uppercase tracking-widest text-emerald-500 mb-3.5">// experience</p>
            <div className="space-y-6 print:space-y-7">
              {experience.map((exp) => (
                <div key={exp.id} className="pl-4 border-l-2 border-emerald-600/50">
                  <div className="flex justify-between items-baseline">
                    <p className="font-bold text-white text-sm print:text-base">{exp.role}</p>
                    <p className="text-neutral-500 text-xs font-mono">{exp.start} – {exp.end}</p>
                  </div>
                  <p className="text-emerald-400/80 text-xs mt-0.5">{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                  <ul className="mt-2 space-y-2 list-disc list-inside text-neutral-300 text-xs print:text-[13.5px] leading-relaxed">
                    {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-emerald-500 mb-2.5">// education</p>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="pl-4 border-l-2 border-neutral-600">
                  <div className="flex justify-between items-baseline">
                    <p className="font-bold text-white text-xs print:text-sm">{edu.degree}</p>
                    <p className="text-neutral-500 text-xs font-mono">{edu.start} – {edu.end}</p>
                  </div>
                  <p className="text-neutral-400 text-xs mt-0.5">{edu.school}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  )
}
