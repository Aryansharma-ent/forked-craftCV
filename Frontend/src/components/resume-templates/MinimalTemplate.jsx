// Minimal Template — classic Harvard/ATS style, centered name, serif font, HR dividers

export default function MinimalTemplate({ personal, experience, education, skills }) {
  return (
    <div className="bg-white rounded-xl shadow-2xl overflow-hidden text-black font-serif text-xs leading-relaxed px-8 py-8 print:min-h-[297mm] print:h-[297mm] print:w-[210mm] print:text-[13.5px] print:px-14 print:py-12 print:rounded-none print:shadow-none flex flex-col justify-between h-full">

      {/* Name centered */}
      <div className="text-center">
        <h1 className="text-2xl print:text-4xl font-bold tracking-wide text-gray-950">{personal.name || 'Your Name'}</h1>
        {personal.title && (
          <p className="text-xs print:text-base text-gray-700 mt-1 font-sans font-medium">{personal.title}</p>
        )}
        {/* Contact line */}
        <p className="text-[11px] print:text-xs text-gray-600 mt-2 font-sans">
          {[personal.email, personal.phone, personal.location, personal.website]
            .filter(Boolean)
            .join('   ·   ')}
        </p>
        <hr className="border-black mt-4" />
      </div>

      {/* Summary */}
      {personal.summary && (
        <div>
          <p className="text-xs print:text-[12px] uppercase tracking-widest font-sans font-bold text-gray-900 mb-1.5">
            Professional Summary
          </p>
          <hr className="border-black mb-3" />
          <p className="text-gray-800 text-xs print:text-[13.5px] leading-relaxed">{personal.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="flex-1 my-2">
          <p className="text-xs print:text-[12px] uppercase tracking-widest font-sans font-bold text-gray-900 mb-1.5">
            Work Experience
          </p>
          <hr className="border-black mb-4" />
          <div className="space-y-6 print:space-y-7">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <p className="font-bold text-sm print:text-base text-gray-950 font-sans">{exp.role}</p>
                  <p className="text-xs text-gray-600 font-sans">{exp.start} – {exp.end}</p>
                </div>
                <p className="italic text-gray-700 text-xs print:text-sm mt-0.5">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                <ul className="mt-2.5 space-y-2 list-disc list-inside text-gray-800 text-xs print:text-[13.5px] leading-relaxed">
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
          <p className="text-xs print:text-[12px] uppercase tracking-widest font-sans font-bold text-gray-900 mb-1.5">
            Education
          </p>
          <hr className="border-black mb-3" />
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <p className="font-bold text-sm print:text-base text-gray-950 font-sans">{edu.degree}</p>
                  <p className="italic text-gray-700 text-xs print:text-sm">{edu.school}</p>
                </div>
                <p className="text-xs text-gray-600 font-sans">{edu.start} – {edu.end}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div>
          <p className="text-xs print:text-[12px] uppercase tracking-widest font-sans font-bold text-gray-900 mb-1.5">
            Technical Skills
          </p>
          <hr className="border-black mb-3" />
          <p className="text-gray-800 text-xs print:text-[13.5px] leading-relaxed font-sans">{skills.join('   ·   ')}</p>
        </div>
      )}

    </div>
  )
}
