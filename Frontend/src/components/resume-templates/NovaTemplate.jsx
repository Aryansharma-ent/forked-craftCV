// Nova Template — two-column: rose/red left sidebar + white right body

export default function NovaTemplate({ personal, experience, education, skills }) {
  return (
    <div className="bg-white rounded-xl shadow-2xl overflow-hidden text-black font-sans text-xs leading-relaxed flex print:min-h-[297mm] print:h-[297mm] print:w-[210mm] print:text-[13px] print:rounded-none print:shadow-none h-full">

      {/* Left Sidebar */}
      <div className="w-[35%] bg-rose-50 border-r border-rose-200 px-6 py-8 flex flex-col justify-between print:px-8 print:py-12 print:h-full print:min-h-[297mm] shrink-0">

        {/* Top block: Name, Title, Contact */}
        <div className="space-y-6 print:space-y-8">
          <div>
            <h1 className="text-xl print:text-3xl font-black text-rose-950 leading-tight">
              {personal.name || 'Your Name'}
            </h1>
            <p className="text-xs print:text-sm text-rose-700 mt-1 font-semibold">{personal.title}</p>
          </div>

          <div>
            <p className="text-[10px] print:text-xs uppercase tracking-widest text-rose-600 font-bold mb-2">Contact</p>
            <div className="space-y-2 text-xs text-gray-700 break-all leading-normal">
              {personal.email    && <p>{personal.email}</p>}
              {personal.phone    && <p>{personal.phone}</p>}
              {personal.location && <p>{personal.location}</p>}
              {personal.website  && <p>{personal.website}</p>}
            </div>
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <p className="text-[10px] print:text-xs uppercase tracking-widest text-rose-600 font-bold mb-2.5">Skills & Tools</p>
              <div className="flex flex-wrap gap-2">
                {skills.map((s, i) => (
                  <span key={i} className="bg-rose-100 text-rose-900 px-2.5 py-1 rounded-md text-xs font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom block: Education */}
        {education.length > 0 && (
          <div className="pt-6 border-t border-rose-200/60">
            <p className="text-[10px] print:text-xs uppercase tracking-widest text-rose-600 font-bold mb-3">Education</p>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <p className="font-bold text-gray-950 text-xs print:text-sm">{edu.degree}</p>
                  <p className="text-gray-700 text-xs">{edu.school}</p>
                  <p className="text-rose-600 text-[11px] font-medium mt-0.5">{edu.start} – {edu.end}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Right Body */}
      <div className="flex-1 px-8 py-8 flex flex-col justify-between print:px-12 print:py-12 print:h-full print:min-h-[297mm]">

        {/* Summary */}
        {personal.summary && (
          <div>
            <p className="text-[10px] print:text-xs uppercase tracking-widest text-rose-700 font-bold border-b border-rose-200 pb-2 mb-3">
              About Me
            </p>
            <p className="text-gray-800 text-xs print:text-[13.5px] leading-relaxed">{personal.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="flex-1 my-4">
            <p className="text-[10px] print:text-xs uppercase tracking-widest text-rose-700 font-bold border-b border-rose-200 pb-2 mb-4">
              Work Experience
            </p>
            <div className="space-y-6 print:space-y-7">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <p className="font-bold text-gray-950 text-sm print:text-base">{exp.role}</p>
                    <p className="text-rose-600 text-xs font-semibold">{exp.start} – {exp.end}</p>
                  </div>
                  <p className="text-gray-600 text-xs italic mt-0.5">{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                  <ul className="mt-2.5 space-y-2 list-disc list-inside text-gray-800 text-xs print:text-[13.5px] leading-relaxed">
                    {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Core Strengths / Highlights footer */}
        <div className="pt-4 border-t border-gray-100 flex justify-between text-xs text-gray-500">
          <span>Portfolio: {personal.website || 'alexchen.dev'}</span>
          <span>Open to new opportunities</span>
        </div>

      </div>
    </div>
  )
}
