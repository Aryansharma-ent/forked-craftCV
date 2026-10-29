// Apex Template — dark slate header, single column body, underline dividers

export default function ApexTemplate({ personal, experience, education, skills }) {
  return (
    <div className="bg-white rounded-xl shadow-2xl overflow-hidden text-black font-sans text-xs leading-relaxed print:min-h-[297mm] print:h-[297mm] print:w-[210mm] print:text-[13px] print:rounded-none print:shadow-none flex flex-col justify-between h-full">

      {/* Header Band */}
      <div className="bg-slate-900 text-white px-8 py-7 print:px-12 print:py-10 shrink-0">
        <h1 className="text-2xl print:text-4xl font-black tracking-tight">{personal.name || 'Your Name'}</h1>
        <p className="text-sm print:text-base text-slate-300 mt-1 font-medium">{personal.title}</p>
        <div className="flex flex-wrap gap-x-6 gap-y-1.5 mt-4 text-xs print:text-[13px] text-slate-400">
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
            <p className="text-xs uppercase tracking-widest text-slate-500 border-b border-gray-200 pb-1.5 mb-2.5 font-bold">
              Professional Summary
            </p>
            <p className="text-gray-800 text-xs print:text-[13.5px] leading-relaxed">{personal.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="my-2">
            <p className="text-xs uppercase tracking-widest text-slate-500 border-b border-gray-200 pb-1.5 mb-3.5 font-bold">
              Work Experience
            </p>
            <div className="space-y-6 print:space-y-7">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <p className="font-bold text-gray-950 text-sm print:text-base">{exp.role}</p>
                    <p className="text-gray-500 text-xs">{exp.start} – {exp.end}</p>
                  </div>
                  <p className="text-gray-600 text-xs mt-0.5">{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                  <ul className="mt-2 space-y-2 list-disc list-inside text-gray-800 text-xs print:text-[13.5px] leading-relaxed">
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
            <p className="text-xs uppercase tracking-widest text-slate-500 border-b border-gray-200 pb-1.5 mb-2.5 font-bold">
              Education
            </p>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline">
                  <div>
                    <p className="font-bold text-gray-950 text-xs print:text-sm">{edu.degree}</p>
                    <p className="text-gray-600 text-xs">{edu.school}</p>
                  </div>
                  <p className="text-gray-500 text-xs">{edu.start} – {edu.end}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500 border-b border-gray-200 pb-1.5 mb-2.5 font-bold">
              Skills & Technologies
            </p>
            <div className="flex flex-wrap gap-2">
              {skills.map((s, i) => (
                <span key={i} className="bg-slate-100 text-slate-900 px-3 py-1 rounded-full text-xs font-medium">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  )
}
